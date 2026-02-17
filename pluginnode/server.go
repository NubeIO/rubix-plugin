package pluginnode

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/NubeIO/rubix-plugin/natslib"
	"github.com/nats-io/nats.go"
	"github.com/rs/zerolog"
)

// ============================================================
// Node interfaces — implement these in your plugin
// ============================================================

// PluginNode is the interface every plugin node type must satisfy.
type PluginNode interface {
	// Init is called once when the node is placed on a wiresheet.
	// Spec contains the node ID, type, and user-configured settings.
	Init(spec NodeSpec) error

	// Close is called when the node is removed from the wiresheet.
	Close() error

	// GetPorts returns the input and output port definitions.
	GetPorts() (inputs []NodePort, outputs []NodePort)

	// OnInputUpdated is an optional notification hook (called before Process).
	OnInputUpdated(portID string, val PortValue)

	// Process is called when an upstream value changes.
	// Return only the ports whose values have changed.
	Process(ctx context.Context, inputs map[string]PortValue) (map[string]PortValue, error)
}

// EmittingNode is an optional interface for nodes that push values autonomously
// (timers, pollers, webhooks, etc.) without waiting to be triggered by Process.
type EmittingNode interface {
	PluginNode
	StartEmitting(ctx EmitContext) error
	StopEmitting() error
}

// SettingsSchemaProvider is an optional interface for nodes that provide a
// JSON Schema describing their settings (for dynamic form rendering in the UI).
type SettingsSchemaProvider interface {
	PluginNode
	SettingsSchema() map[string]interface{}
}

// NodeFactory creates a node instance for a given node type string.
// Return nil for unknown types (rubix will report an init error).
type NodeFactory func(nodeType string) PluginNode

// EmitContext is passed to StartEmitting — call Emit to push values autonomously.
type EmitContext struct {
	NodeID string
	Emit   func(portHandle string, value PortValue) error
	Logger zerolog.Logger
}

// ============================================================
// PluginServer
// ============================================================

// ServerConfig is the old config type kept for backwards compatibility.
// New code should use PluginServerConfig.
type ServerConfig = PluginServerConfig

// PluginServerConfig configures a PluginServer.
type PluginServerConfig struct {
	NATSClient     *natslib.Client
	Prefix         string // e.g. "rubix.v1.local"
	OrgID          string
	DeviceID       string
	Vendor         string
	PluginName     string
	Version        string
	Factory        NodeFactory // nil = app-only plugin (no node types)
	Logger         zerolog.Logger
	AutoStartNodes bool // call StartEmitting right after Init
}

// PluginServer subscribes to NATS and routes rubix RPC calls to plugin nodes.
// For app-only plugins (Factory == nil) it handles health + control only.
// For node plugins it also handles the full node RPC lifecycle.
type PluginServer struct {
	nc  *natslib.Client
	sb  *SubjectBuilder
	cfg PluginServerConfig
	log zerolog.Logger

	// node registry
	nodes         map[string]PluginNode
	emittingNodes map[string]EmittingNode
	nodeStates    map[string]string // "running" | "stopped"
	mu            sync.RWMutex

	// plugin-level state
	pluginState string
	startTime   time.Time

	// NATS subscriptions
	rpcSub      *nats.Subscription
	healthSub   *nats.Subscription
	controlSub  *nats.Subscription
	nodeCtrlSub *nats.Subscription
}

// NewPluginServer creates and starts the plugin server.
func NewPluginServer(cfg PluginServerConfig) (*PluginServer, error) {
	sb := NewSubjectBuilder(cfg.Prefix, cfg.OrgID, cfg.DeviceID, cfg.Vendor, cfg.PluginName)

	ps := &PluginServer{
		nc:            cfg.NATSClient,
		sb:            sb,
		cfg:           cfg,
		log:           cfg.Logger.With().Str("comp", "plugin_server").Str("plugin", cfg.PluginName).Logger(),
		nodes:         make(map[string]PluginNode),
		emittingNodes: make(map[string]EmittingNode),
		nodeStates:    make(map[string]string),
		pluginState:   "running",
		startTime:     time.Now(),
	}

	var err error

	// health
	ps.healthSub, err = cfg.NATSClient.SubscribeMsg(sb.Health(), ps.handleHealth)
	if err != nil {
		return nil, fmt.Errorf("subscribe health: %w", err)
	}
	ps.log.Info().Str("subject", sb.Health()).Msg("subscribed to health checks")

	// plugin-level control
	ps.controlSub, err = cfg.NATSClient.SubscribeMsg(sb.PluginControl(), ps.handlePluginControl)
	if err != nil {
		return nil, fmt.Errorf("subscribe control: %w", err)
	}
	ps.log.Info().Str("subject", sb.PluginControl()).Msg("subscribed to plugin control")

	// node RPC + node control (only when Factory is provided)
	if cfg.Factory != nil {
		ps.rpcSub, err = cfg.NATSClient.SubscribeMsg(sb.RPCWildcard(), ps.handleRPC)
		if err != nil {
			return nil, fmt.Errorf("subscribe rpc: %w", err)
		}
		ps.log.Info().Str("subject", sb.RPCWildcard()).Msg("subscribed to node RPC")

		ps.nodeCtrlSub, err = cfg.NATSClient.SubscribeMsg(sb.NodeControlWildcard(), ps.handleNodeControl)
		if err != nil {
			return nil, fmt.Errorf("subscribe node control: %w", err)
		}
		ps.log.Info().Str("subject", sb.NodeControlWildcard()).Msg("subscribed to node control")
	}

	ps.log.Info().Msg("plugin server started")
	return ps, nil
}

// Close stops all nodes and unsubscribes from NATS.
func (ps *PluginServer) Close() {
	for _, sub := range []*nats.Subscription{ps.rpcSub, ps.healthSub, ps.controlSub, ps.nodeCtrlSub} {
		if sub != nil {
			sub.Unsubscribe()
		}
	}
	ps.mu.Lock()
	for nodeID, n := range ps.emittingNodes {
		if err := n.StopEmitting(); err != nil {
			ps.log.Warn().Err(err).Str("nodeId", nodeID).Msg("stop emitting")
		}
	}
	ps.mu.Unlock()
	for nodeID, n := range ps.nodes {
		if err := n.Close(); err != nil {
			ps.log.Warn().Err(err).Str("nodeId", nodeID).Msg("close node")
		}
	}
	ps.log.Info().Msg("plugin server stopped")
}

// Emit publishes an autonomous value emission from a node port.
func (ps *PluginServer) Emit(nodeID, portHandle string, value PortValue) error {
	event := EmitEvent{
		NodeID:     nodeID,
		PortHandle: portHandle,
		Value:      value,
		Timestamp:  time.Now().UTC().Format(time.RFC3339),
	}
	data, err := json.Marshal(event)
	if err != nil {
		return fmt.Errorf("marshal emit: %w", err)
	}
	subject := ps.sb.Emit(nodeID, portHandle)
	if err := ps.nc.Publish(subject, data); err != nil {
		return fmt.Errorf("publish emit: %w", err)
	}
	ps.log.Debug().Str("nodeId", nodeID).Str("port", portHandle).Msg("→ emitted")
	return nil
}

// ============================================================
// Node RPC handler
// ============================================================

func (ps *PluginServer) handleRPC(msg *nats.Msg) {
	var req RPCRequest
	if err := json.Unmarshal(msg.Data, &req); err != nil {
		ps.replyError(msg, fmt.Errorf("parse request: %w", err))
		return
	}
	ps.log.Debug().Str("method", string(req.Method)).Str("nodeId", req.NodeID).Msg("← RPC")

	var (
		resp RPCResponse
		err  error
	)
	switch req.Method {
	case MethodInit:
		resp, err = ps.handleInit(req)
	case MethodProcess:
		resp, err = ps.handleProcess(req)
	case MethodClose:
		resp, err = ps.handleClose(req)
	case MethodPing:
		resp = RPCResponse{Success: true, Data: PingResponse{NodeID: req.NodeID, Status: "running", Version: ps.cfg.Version}}
	default:
		err = fmt.Errorf("unknown method: %s", req.Method)
	}
	if err != nil {
		ps.replyError(msg, err)
		return
	}
	data, _ := json.Marshal(resp)
	msg.Respond(data)
}

func (ps *PluginServer) handleInit(req RPCRequest) (RPCResponse, error) {
	var initReq InitRequest
	if err := remarshal(req.Payload, &initReq); err != nil {
		return RPCResponse{}, fmt.Errorf("parse init payload: %w", err)
	}

	node := ps.cfg.Factory(initReq.Spec.Type)
	if node == nil {
		return RPCResponse{}, fmt.Errorf("unknown node type: %s", initReq.Spec.Type)
	}
	if err := node.Init(initReq.Spec); err != nil {
		return RPCResponse{}, fmt.Errorf("node init: %w", err)
	}
	ps.nodes[req.NodeID] = node

	// autonomous emission support
	if en, ok := node.(EmittingNode); ok {
		ps.mu.Lock()
		ps.emittingNodes[req.NodeID] = en
		ps.nodeStates[req.NodeID] = "stopped"
		ps.mu.Unlock()

		if ps.cfg.AutoStartNodes {
			nodeID := req.NodeID
			ec := EmitContext{
				NodeID: nodeID,
				Emit: func(port string, val PortValue) error {
					return ps.Emit(nodeID, port, val)
				},
				Logger: ps.log,
			}
			if err := en.StartEmitting(ec); err != nil {
				ps.log.Warn().Err(err).Str("nodeId", nodeID).Msg("auto-start emit failed")
			} else {
				ps.mu.Lock()
				ps.nodeStates[nodeID] = "running"
				ps.mu.Unlock()
				ps.log.Info().Str("nodeId", nodeID).Msg("auto-started emitting node")
			}
		}
	}

	inputs, outputs := node.GetPorts()
	var schema map[string]interface{}
	if sp, ok := node.(SettingsSchemaProvider); ok {
		schema = sp.SettingsSchema()
	}
	return RPCResponse{Success: true, Data: InitResponse{
		Inputs:         inputs,
		Outputs:        outputs,
		SettingsSchema: schema,
	}}, nil
}

func (ps *PluginServer) handleProcess(req RPCRequest) (RPCResponse, error) {
	node, ok := ps.nodes[req.NodeID]
	if !ok {
		return RPCResponse{}, fmt.Errorf("node not found: %s", req.NodeID)
	}
	var procReq ProcessRequest
	if err := remarshal(req.Payload, &procReq); err != nil {
		return RPCResponse{}, fmt.Errorf("parse process payload: %w", err)
	}
	outputs, err := node.Process(context.Background(), procReq.Inputs)
	if err != nil {
		return RPCResponse{}, fmt.Errorf("process: %w", err)
	}
	return RPCResponse{Success: true, Data: ProcessResponse{Outputs: outputs}}, nil
}

func (ps *PluginServer) handleClose(req RPCRequest) (RPCResponse, error) {
	node, ok := ps.nodes[req.NodeID]
	if !ok {
		return RPCResponse{}, fmt.Errorf("node not found: %s", req.NodeID)
	}
	if en, ok := ps.emittingNodes[req.NodeID]; ok {
		en.StopEmitting()
		ps.mu.Lock()
		delete(ps.emittingNodes, req.NodeID)
		delete(ps.nodeStates, req.NodeID)
		ps.mu.Unlock()
	}
	if err := node.Close(); err != nil {
		return RPCResponse{}, fmt.Errorf("close: %w", err)
	}
	delete(ps.nodes, req.NodeID)
	return RPCResponse{Success: true}, nil
}

// ============================================================
// Health handler
// ============================================================

func (ps *PluginServer) handleHealth(msg *nats.Msg) {
	ps.log.Debug().Msg("← health check")
	resp := RPCResponse{
		Success: true,
		Data:    PingResponse{Status: "running", Version: ps.cfg.Version},
	}
	data, _ := json.Marshal(resp)
	msg.Respond(data)
}

// ============================================================
// Plugin-level control handler
// ============================================================

func (ps *PluginServer) handlePluginControl(msg *nats.Msg) {
	var cmd PluginControlCommand
	if err := json.Unmarshal(msg.Data, &cmd); err != nil {
		ps.replyControlError(msg, err)
		return
	}
	ps.log.Info().Str("command", cmd.Command).Msg("← plugin control")

	ps.mu.RLock()
	nodeCount := len(ps.nodes)
	uptime := int(time.Since(ps.startTime).Seconds())
	state := ps.pluginState
	ps.mu.RUnlock()

	resp := PluginControlResponse{
		Command:   cmd.Command,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	switch cmd.Command {
	case "ping", "getStatus":
		resp.Success = true
		resp.State = state
		resp.NodeCount = nodeCount
		resp.Uptime = uptime
		resp.Message = fmt.Sprintf("plugin running with %d nodes", nodeCount)

	case "stop":
		ps.mu.Lock()
		for id, en := range ps.emittingNodes {
			en.StopEmitting()
			ps.nodeStates[id] = "stopped"
		}
		ps.pluginState = "stopped"
		ps.mu.Unlock()
		resp.Success = true
		resp.State = "stopped"
		resp.Message = "plugin stopped"

	case "start":
		ps.mu.Lock()
		for id, en := range ps.emittingNodes {
			if ps.nodeStates[id] == "stopped" {
				nodeID := id
				ec := EmitContext{NodeID: nodeID, Emit: func(port string, val PortValue) error {
					return ps.Emit(nodeID, port, val)
				}, Logger: ps.log}
				if err := en.StartEmitting(ec); err == nil {
					ps.nodeStates[id] = "running"
				}
			}
		}
		ps.pluginState = "running"
		ps.mu.Unlock()
		resp.Success = true
		resp.State = "running"
		resp.Message = "plugin started"

	case "restart":
		ps.mu.Lock()
		for id, en := range ps.emittingNodes {
			en.StopEmitting()
			ps.nodeStates[id] = "stopped"
		}
		ps.mu.Unlock()
		time.Sleep(100 * time.Millisecond)
		ps.mu.Lock()
		for id, en := range ps.emittingNodes {
			nodeID := id
			ec := EmitContext{NodeID: nodeID, Emit: func(port string, val PortValue) error {
				return ps.Emit(nodeID, port, val)
			}, Logger: ps.log}
			if err := en.StartEmitting(ec); err == nil {
				ps.nodeStates[id] = "running"
			}
		}
		ps.pluginState = "running"
		ps.mu.Unlock()
		resp.Success = true
		resp.State = "running"
		resp.Message = "plugin restarted"

	default:
		resp.Success = false
		resp.State = state
		resp.Error = fmt.Sprintf("unknown command: %s", cmd.Command)
	}

	data, _ := json.Marshal(resp)
	msg.Respond(data)
}

// ============================================================
// Node-level control handler
// ============================================================

func (ps *PluginServer) handleNodeControl(msg *nats.Msg) {
	var cmd NodeControlCommand
	if err := json.Unmarshal(msg.Data, &cmd); err != nil {
		ps.replyControlError(msg, err)
		return
	}
	ps.log.Info().Str("command", cmd.Command).Str("nodeId", cmd.NodeID).Msg("← node control")

	resp := NodeControlResponse{
		Command:   cmd.Command,
		NodeID:    cmd.NodeID,
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	}

	ps.mu.RLock()
	en, isEmitting := ps.emittingNodes[cmd.NodeID]
	curState := ps.nodeStates[cmd.NodeID]
	ps.mu.RUnlock()

	if !isEmitting {
		resp.Success = false
		resp.State = "unknown"
		resp.Error = fmt.Sprintf("node is not an emitting node: %s", cmd.NodeID)
		data, _ := json.Marshal(resp)
		msg.Respond(data)
		return
	}

	switch cmd.Command {
	case "start":
		if curState == "running" {
			resp.Success = true
			resp.State = "running"
			resp.Message = "already running"
		} else {
			nodeID := cmd.NodeID
			ec := EmitContext{NodeID: nodeID, Emit: func(port string, val PortValue) error {
				return ps.Emit(nodeID, port, val)
			}, Logger: ps.log}
			if err := en.StartEmitting(ec); err != nil {
				resp.Success = false
				resp.State = "stopped"
				resp.Error = err.Error()
			} else {
				ps.mu.Lock()
				ps.nodeStates[cmd.NodeID] = "running"
				ps.mu.Unlock()
				resp.Success = true
				resp.State = "running"
				resp.Message = "node started"
			}
		}
	case "stop":
		if curState == "stopped" {
			resp.Success = true
			resp.State = "stopped"
			resp.Message = "already stopped"
		} else {
			if err := en.StopEmitting(); err != nil {
				resp.Success = false
				resp.State = "running"
				resp.Error = err.Error()
			} else {
				ps.mu.Lock()
				ps.nodeStates[cmd.NodeID] = "stopped"
				ps.mu.Unlock()
				resp.Success = true
				resp.State = "stopped"
				resp.Message = "node stopped"
			}
		}
	default:
		resp.Success = false
		resp.State = curState
		resp.Error = fmt.Sprintf("unknown command: %s", cmd.Command)
	}

	data, _ := json.Marshal(resp)
	msg.Respond(data)
}

// ============================================================
// Helpers
// ============================================================

func (ps *PluginServer) replyError(msg *nats.Msg, err error) {
	ps.log.Error().Err(err).Msg("RPC error")
	data, _ := json.Marshal(RPCResponse{Success: false, Error: err.Error()})
	msg.Respond(data)
}

func (ps *PluginServer) replyControlError(msg *nats.Msg, err error) {
	ps.log.Error().Err(err).Msg("control error")
	data, _ := json.Marshal(PluginControlResponse{
		Success:   false,
		Error:     err.Error(),
		Timestamp: time.Now().UTC().Format(time.RFC3339),
	})
	msg.Respond(data)
}

// remarshal round-trips through JSON to convert any→typed struct.
func remarshal(src any, dst any) error {
	b, err := json.Marshal(src)
	if err != nil {
		return err
	}
	return json.Unmarshal(b, dst)
}
