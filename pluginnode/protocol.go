package pluginnode

// protocol.go — NATS RPC types for rubix node plugins.
//
// JSON field names MUST match github.com/NubeIO/rubix/internal/models exactly
// so that serialisation round-trips between rubix and external plugins work.

// RPCMethod names the operation being invoked on a node.
type RPCMethod string

const (
	MethodInit    RPCMethod = "init"
	MethodProcess RPCMethod = "process"
	MethodClose   RPCMethod = "close"
	MethodPing    RPCMethod = "ping"
)

// RPCRequest is the envelope rubix sends via NATS request/reply.
type RPCRequest struct {
	Method  RPCMethod `json:"method"`
	NodeID  string    `json:"nodeId"`
	Payload any       `json:"payload,omitempty"`
}

// RPCResponse is what the plugin must send back.
type RPCResponse struct {
	Success bool   `json:"success"`
	Error   string `json:"error,omitempty"`
	Data    any    `json:"data,omitempty"`
}

// ============================================================
// Port types — JSON tags mirror models.NodePort / models.PortValue
// ============================================================

// NodePort describes a single input or output port.
// Field names and json tags match models.NodePort in rubix exactly.
type NodePort struct {
	Handle      string `json:"handle"`               // e.g. "in1", "out"
	Name        string `json:"name"`                  // human-readable label
	Kind        string `json:"kind"`                  // "input" or "output"
	Type        string `json:"type,omitempty"`        // "number", "string", "bool", "any"
	Description string `json:"description,omitempty"` // tooltip
}

// PortValue carries a typed value over a port.
// JSON tags match models.PortValue in rubix exactly.
type PortValue struct {
	ValueNum  *float64               `json:"valueNum,omitempty"`
	ValueStr  *string                `json:"valueStr,omitempty"`
	ValueBool *bool                  `json:"valueBool,omitempty"`
	ValueJSON map[string]interface{} `json:"valueJSON,omitempty"` // capital JSON — matches rubix
}

// NumVal constructs a numeric PortValue.
func NumVal(v float64) PortValue { return PortValue{ValueNum: &v} }

// NumberVal is an alias for NumVal.
func NumberVal(v float64) PortValue { return NumVal(v) }

// StrVal constructs a string PortValue.
func StrVal(v string) PortValue { return PortValue{ValueStr: &v} }

// BoolVal constructs a boolean PortValue.
func BoolVal(v bool) PortValue { return PortValue{ValueBool: &v} }

// ============================================================
// Init
// ============================================================

// NodeSpec is the subset of models.Node that a plugin cares about.
type NodeSpec struct {
	ID       string                 `json:"id"`
	Type     string                 `json:"type"`
	Settings map[string]interface{} `json:"settings,omitempty"`
}

// InitRequest payload for MethodInit.
type InitRequest struct {
	Spec NodeSpec `json:"spec"`
}

// InitResponse is returned by MethodInit.
type InitResponse struct {
	Inputs         []NodePort             `json:"inputs"`
	Outputs        []NodePort             `json:"outputs"`
	SettingsSchema map[string]interface{} `json:"settingsSchema,omitempty"`
}

// ============================================================
// Process
// ============================================================

// ProcessRequest payload for MethodProcess.
type ProcessRequest struct {
	Inputs map[string]PortValue `json:"inputs"`
}

// ProcessResponse is returned by MethodProcess.
type ProcessResponse struct {
	Outputs map[string]PortValue `json:"outputs"`
}

// ============================================================
// Control (plugin-level and node-level) — matches internal protocol
// ============================================================

// PluginControlCommand is sent by rubix for plugin lifecycle control.
type PluginControlCommand struct {
	Command   string                 `json:"command"`
	Timestamp string                 `json:"timestamp"`
	Params    map[string]interface{} `json:"params,omitempty"`
}

// PluginControlResponse is the plugin's response to a control command.
type PluginControlResponse struct {
	Success   bool   `json:"success"`
	Command   string `json:"command"`
	State     string `json:"state"`
	Message   string `json:"message,omitempty"`
	Error     string `json:"error,omitempty"`
	NodeCount int    `json:"nodeCount,omitempty"`
	Uptime    int    `json:"uptime,omitempty"`
	Timestamp string `json:"timestamp"`
}

// NodeControlCommand is sent by rubix for node-level control.
type NodeControlCommand struct {
	Command   string                 `json:"command"`
	NodeID    string                 `json:"nodeId"`
	Timestamp string                 `json:"timestamp"`
	Params    map[string]interface{} `json:"params,omitempty"`
}

// NodeControlResponse is the plugin's response to a node control command.
type NodeControlResponse struct {
	Success   bool   `json:"success"`
	Command   string `json:"command"`
	NodeID    string `json:"nodeId"`
	State     string `json:"state"`
	Message   string `json:"message,omitempty"`
	Error     string `json:"error,omitempty"`
	Timestamp string `json:"timestamp"`
}

// ============================================================
// Autonomous emission
// ============================================================

// EmitEvent is published by a plugin node to push an autonomous value.
// Publish to sb.Emit(nodeID, portHandle).
type EmitEvent struct {
	NodeID     string    `json:"nodeId"`
	PortHandle string    `json:"portHandle"`
	Value      PortValue `json:"value"`
	Timestamp  string    `json:"timestamp,omitempty"`
}

// PingResponse is returned by MethodPing and health checks.
type PingResponse struct {
	NodeID  string `json:"nodeId,omitempty"`
	Status  string `json:"status,omitempty"`
	Version string `json:"version,omitempty"`
}
