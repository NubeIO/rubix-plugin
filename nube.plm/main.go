package main

import (
	"flag"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/NubeIO/rubix-plm-plugin/internal/hooks"
	"github.com/NubeIO/rubix-plm-plugin/internal/nodes"
	"github.com/NubeIO/rubix-plugin/natslib"
	"github.com/NubeIO/rubix-plugin/nodehooks"
	"github.com/NubeIO/rubix-plugin/pluginnode"
	"github.com/rs/zerolog"
)

func main() {
	// Parse command-line flags
	natsURL := flag.String("nats", "nats://localhost:4222", "NATS server URL")
	orgID := flag.String("org", "org1", "Organization ID")
	deviceID := flag.String("device", "device0", "Device ID")
	prefix := flag.String("prefix", "rubix.v1.local", "NATS subject prefix")
	vendor := flag.String("vendor", "nube", "Plugin vendor")
	pluginName := flag.String("name", "plm", "Plugin name")
	logLevel := flag.String("log", "info", "Log level (debug/info/warn/error)")
	flag.Parse()

	// Setup logger
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
		Msg("starting PLM plugin")

	// Connect to NATS
	nc, err := natslib.Connect(*natsURL)
	if err != nil {
		logger.Fatal().Err(err).Msg("failed to connect to NATS")
	}
	defer nc.Close()
	logger.Info().Msg("connected to NATS")

	// Node factory
	factory := func(nodeType string) pluginnode.PluginNode {
		switch nodeType {
		case "plm.product":
			return &nodes.ProductNode{}
		default:
			return nil
		}
	}

	// Start the plugin server
	server, err := pluginnode.NewPluginServer(pluginnode.PluginServerConfig{
		NATSClient:     nc,
		Prefix:         *prefix,
		OrgID:          *orgID,
		DeviceID:       *deviceID,
		Vendor:         *vendor,
		PluginName:     *pluginName,
		Version:        "1.0.0",
		Factory:        factory,
		Logger:         logger,
		AutoStartNodes: true,
	})
	if err != nil {
		logger.Fatal().Err(err).Msg("failed to create plugin server")
	}
	defer server.Close()

	// Register node CRUD hooks via NATS
	plmHooks := hooks.NewPLMNodeHooks()
	hookSubjects := nodehooks.NewSubjectBuilder(*prefix, *orgID, *deviceID, *vendor, *pluginName)
	hookHandler := nodehooks.NewNATSHandler(plmHooks, nc, hookSubjects)
	if err := hookHandler.RegisterAll(); err != nil {
		logger.Fatal().Err(err).Msg("failed to register node hooks")
	}
	defer hookHandler.Unsubscribe()

	logger.Info().Msg("PLM plugin started — product nodes ready + CRUD hooks active")

	// Wait for shutdown signal
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)
	<-sigCh
	logger.Info().Msg("shutdown signal received")
}
