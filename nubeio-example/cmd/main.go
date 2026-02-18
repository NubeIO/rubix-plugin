package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"sync"
	"syscall"
	"time"

	"github.com/NubeIO/rubix-plugin/natslib"
	"github.com/NubeIO/rubix-plugin/pluginnode"
	"github.com/rs/zerolog"
)

// ============================================================
// ExampleNode — demonstrates inputs, outputs, and all port types.
//
// Inputs (1):
//   in_multiplier  number   — multiplied against the counter each tick (default 1)
//
// Outputs (3):
//   out_toggle     bool     — alternates true/false on every tick
//   out_count      number   — tick counter × multiplier
//   out_message    string   — human-readable status line
// ============================================================

type ExampleNode struct {
	mu       sync.Mutex
	id       string
	settings map[string]interface{}
	log      zerolog.Logger

	// input state (updated via OnInputUpdated / Process)
	multiplier float64

	// output state
	toggle  bool
	counter float64

	// emitting
	ticker *time.Ticker
	cancel context.CancelFunc
	done   chan struct{}
}

func (n *ExampleNode) Init(spec pluginnode.NodeSpec) error {
	n.mu.Lock()
	defer n.mu.Unlock()
	n.id = spec.ID
	n.settings = spec.Settings
	n.multiplier = 1.0 // default
	n.log.Info().Str("nodeId", spec.ID).Msg("example node initialized")
	return nil
}

func (n *ExampleNode) Close() error {
	if n.cancel != nil {
		n.StopEmitting()
	}
	n.log.Info().Str("nodeId", n.id).Msg("example node closed")
	return nil
}

func (n *ExampleNode) GetPorts() (inputs []pluginnode.NodePort, outputs []pluginnode.NodePort) {
	inputs = []pluginnode.NodePort{
		{
			Handle:      "in_multiplier",
			Name:        "Multiplier",
			Kind:        "input",
			Type:        "number",
			Description: "Multiplied against the counter on every tick (default 1)",
		},
	}
	outputs = []pluginnode.NodePort{
		{
			Handle:      "out_toggle",
			Name:        "Toggle",
			Kind:        "output",
			Type:        "bool",
			Description: "Alternates true/false on every tick",
		},
		{
			Handle:      "out_count",
			Name:        "Count",
			Kind:        "output",
			Type:        "number",
			Description: "Tick counter × multiplier",
		},
		{
			Handle:      "out_message",
			Name:        "Message",
			Kind:        "output",
			Type:        "string",
			Description: "Human-readable status line",
		},
	}
	return inputs, outputs
}

// OnInputUpdated is called whenever an upstream node writes to one of our inputs.
func (n *ExampleNode) OnInputUpdated(portID string, val pluginnode.PortValue) {
	if portID == "in_multiplier" && val.ValueNum != nil {
		n.mu.Lock()
		n.multiplier = *val.ValueNum
		n.mu.Unlock()
		n.log.Debug().Str("nodeId", n.id).Float64("multiplier", *val.ValueNum).Msg("multiplier updated")
	}
}

// Process is called when rubix wants the current output values (e.g. on graph eval).
func (n *ExampleNode) Process(_ context.Context, inputs map[string]pluginnode.PortValue) (map[string]pluginnode.PortValue, error) {
	if v, ok := inputs["in_multiplier"]; ok && v.ValueNum != nil {
		n.mu.Lock()
		n.multiplier = *v.ValueNum
		n.mu.Unlock()
	}
	n.mu.Lock()
	toggle := n.toggle
	count := n.counter * n.multiplier
	msg := fmt.Sprintf("tick %.0f — toggle=%v count=%.2f", n.counter, toggle, count)
	n.mu.Unlock()

	return map[string]pluginnode.PortValue{
		"out_toggle":  pluginnode.BoolVal(toggle),
		"out_count":   pluginnode.NumberVal(count),
		"out_message": pluginnode.StrVal(msg),
	}, nil
}

func (n *ExampleNode) SettingsSchema() map[string]interface{} {
	return map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"interval": map[string]interface{}{
				"type":        "number",
				"title":       "Interval (ms)",
				"description": "Time between tick emissions in milliseconds",
				"default":     5000,
				"minimum":     100,
			},
		},
	}
}

// StartEmitting starts the background ticker — implements EmittingNode.
func (n *ExampleNode) StartEmitting(ctx pluginnode.EmitContext) error {
	n.done = make(chan struct{})

	interval := 5 * time.Second
	if v, ok := n.settings["interval"].(float64); ok && v >= 100 {
		interval = time.Duration(v) * time.Millisecond
	}

	n.ticker = time.NewTicker(interval)
	emitCtx, cancel := context.WithCancel(context.Background())
	n.cancel = cancel

	go func() {
		defer close(n.done)
		n.log.Info().Str("nodeId", n.id).Dur("interval", interval).Msg("started emissions")
		for {
			select {
			case <-emitCtx.Done():
				n.log.Info().Str("nodeId", n.id).Msg("stopped emissions")
				return
			case <-n.ticker.C:
				n.mu.Lock()
				n.toggle = !n.toggle
				n.counter++
				toggle := n.toggle
				count := n.counter * n.multiplier
				msg := fmt.Sprintf("tick %.0f — toggle=%v count=%.2f", n.counter, toggle, count)
				n.mu.Unlock()

				emitAll(ctx, n.log, n.id, toggle, count, msg)
			}
		}
	}()
	return nil
}

func emitAll(ctx pluginnode.EmitContext, log zerolog.Logger, nodeID string, toggle bool, count float64, msg string) {
	emit := func(port string, val pluginnode.PortValue) {
		if err := ctx.Emit(port, val); err != nil {
			log.Error().Err(err).Str("port", port).Msg("emit failed")
		}
	}
	emit("out_toggle", pluginnode.BoolVal(toggle))
	emit("out_count", pluginnode.NumberVal(count))
	emit("out_message", pluginnode.StrVal(msg))
	log.Info().Str("nodeId", nodeID).Bool("toggle", toggle).Float64("count", count).Str("msg", msg).Msg("→ tick")
}

// StopEmitting stops the background ticker — implements EmittingNode.
func (n *ExampleNode) StopEmitting() error {
	if n.cancel != nil {
		n.cancel()
		n.cancel = nil
	}
	if n.ticker != nil {
		n.ticker.Stop()
		n.ticker = nil
	}
	if n.done != nil {
		<-n.done
		n.done = nil
	}
	n.log.Info().Str("nodeId", n.id).Msg("stopped emitting")
	return nil
}

// ============================================================
// Factory
// ============================================================

func nodeFactory(nodeType string) pluginnode.PluginNode {
	switch nodeType {
	case "nube.example":
		return &ExampleNode{multiplier: 1.0}
	default:
		return nil
	}
}

// ============================================================
// main
// ============================================================

func main() {
	natsURL := flag.String("nats", "nats://localhost:4222", "NATS server URL")
	orgID := flag.String("org", "org1", "Organization ID")
	deviceID := flag.String("device", "device0", "Device ID")
	prefix := flag.String("prefix", "rubix.v1.local", "NATS subject prefix")
	vendor := flag.String("vendor", "nube", "Plugin vendor")
	pluginName := flag.String("name", "example", "Plugin name")
	logLevel := flag.String("log", "info", "Log level (debug/info/warn/error)")
	flag.Parse()

	level, err := zerolog.ParseLevel(*logLevel)
	if err != nil {
		level = zerolog.InfoLevel
	}
	logger := zerolog.New(zerolog.ConsoleWriter{Out: os.Stderr, TimeFormat: time.Kitchen}).
		Level(level).
		With().Timestamp().Str("plugin", *pluginName).Logger()

	logger.Info().
		Str("nats", *natsURL).
		Str("org", *orgID).
		Str("device", *deviceID).
		Msg(fmt.Sprintf("starting %s plugin", *pluginName))

	nc, err := natslib.Connect(*natsURL)
	if err != nil {
		logger.Fatal().Err(err).Msg("failed to connect to NATS")
	}
	defer nc.Close()
	logger.Info().Msg("connected to NATS")

	server, err := pluginnode.NewPluginServer(pluginnode.PluginServerConfig{
		NATSClient:     nc,
		Prefix:         *prefix,
		OrgID:          *orgID,
		DeviceID:       *deviceID,
		Vendor:         *vendor,
		PluginName:     *pluginName,
		Version:        "1.0.0",
		Factory:        nodeFactory,
		Logger:         logger,
		AutoStartNodes: true,
	})
	if err != nil {
		logger.Fatal().Err(err).Msg("failed to create plugin server")
	}
	defer server.Close()

	logger.Info().Msg("plugin server started — listening for health, control and node RPC")

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)

	heartbeat := time.NewTicker(30 * time.Second)
	defer heartbeat.Stop()

	for {
		select {
		case <-sigCh:
			logger.Info().Msg("shutdown signal received")
			return
		case <-heartbeat.C:
			logger.Debug().Msg("heartbeat")
		}
	}
}
