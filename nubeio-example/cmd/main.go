package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/NubeIO/rubix-plugin/natslib"
	"github.com/NubeIO/rubix-plugin/pluginnode"
	"github.com/rs/zerolog"
)

// ============================================================
// TriggerNode — toggles true/false on a configurable interval
// Mirrors examples/plugin-counter TriggerNode using rubix-plugin types
// ============================================================

type TriggerNode struct {
	id       string
	settings map[string]interface{}
	outputs  []pluginnode.NodePort
	log      zerolog.Logger

	emitCtx     *pluginnode.EmitContext
	ticker      *time.Ticker
	cancel      context.CancelFunc
	done        chan struct{}
	toggleState bool
}

func (n *TriggerNode) Init(spec pluginnode.NodeSpec) error {
	n.id = spec.ID
	n.settings = spec.Settings
	n.outputs = []pluginnode.NodePort{
		{
			Handle: "trigger",
			Name:   "Trigger",
			Kind:   "output",
			Type:   "bool",
		},
	}
	n.log.Info().Str("nodeId", spec.ID).Msg("trigger node initialized")
	return nil
}

func (n *TriggerNode) Close() error {
	if n.cancel != nil {
		n.StopEmitting()
	}
	n.log.Info().Str("nodeId", n.id).Msg("trigger node closed")
	return nil
}

func (n *TriggerNode) GetPorts() ([]pluginnode.NodePort, []pluginnode.NodePort) {
	return nil, n.outputs
}

func (n *TriggerNode) OnInputUpdated(_ string, _ pluginnode.PortValue) {}

func (n *TriggerNode) Process(_ context.Context, _ map[string]pluginnode.PortValue) (map[string]pluginnode.PortValue, error) {
	return map[string]pluginnode.PortValue{
		"trigger": pluginnode.BoolVal(n.toggleState),
	}, nil
}

func (n *TriggerNode) SettingsSchema() map[string]interface{} {
	return map[string]interface{}{
		"type": "object",
		"properties": map[string]interface{}{
			"interval": map[string]interface{}{
				"type":        "number",
				"title":       "Interval (ms)",
				"description": "Time between trigger emissions in milliseconds",
				"default":     5000,
				"minimum":     100,
			},
		},
	}
}

// StartEmitting starts the background ticker — implements EmittingNode.
func (n *TriggerNode) StartEmitting(ctx pluginnode.EmitContext) error {
	n.emitCtx = &ctx
	n.done = make(chan struct{})

	interval := 5 * time.Second
	if v, ok := n.settings["interval"].(float64); ok {
		interval = time.Duration(v) * time.Millisecond
	}

	n.ticker = time.NewTicker(interval)
	emitCtx, cancel := context.WithCancel(context.Background())
	n.cancel = cancel

	go func() {
		defer close(n.done)
		n.log.Info().Str("nodeId", n.id).Dur("interval", interval).Msg("started autonomous emissions")
		for {
			select {
			case <-emitCtx.Done():
				n.log.Info().Str("nodeId", n.id).Msg("stopped autonomous emissions")
				return
			case <-n.ticker.C:
				n.toggleState = !n.toggleState
				if err := ctx.Emit("trigger", pluginnode.BoolVal(n.toggleState)); err != nil {
					n.log.Error().Err(err).Msg("failed to emit trigger")
				} else {
					n.log.Info().Str("nodeId", n.id).Bool("value", n.toggleState).Msg("→ emitted trigger")
				}
			}
		}
	}()
	return nil
}

// StopEmitting stops the background ticker — implements EmittingNode.
func (n *TriggerNode) StopEmitting() error {
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
	case "nube.trigger":
		return &TriggerNode{}
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
	pluginName := flag.String("name", "projectmgmt", "Plugin name")
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

	ticker := time.NewTicker(30 * time.Second)
	defer ticker.Stop()

	for {
		select {
		case <-sigCh:
			logger.Info().Msg("shutdown signal received")
			return
		case <-ticker.C:
			logger.Debug().Msg("heartbeat")
		}
	}
}
