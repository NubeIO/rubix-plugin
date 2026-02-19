package main

import (
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/NubeIO/rubix-plugin/natslib"
	"github.com/NubeIO/rubix-plugin/pluginnode"
	"github.com/NubeIO/nubeio-taskmanager/internal/datastore"
	"github.com/NubeIO/nubeio-taskmanager/internal/node"
	"github.com/rs/zerolog"
)

func main() {
	natsURL := flag.String("nats", "nats://localhost:4222", "NATS server URL")
	orgID := flag.String("org", "org1", "Organization ID")
	deviceID := flag.String("device", "device0", "Device ID")
	prefix := flag.String("prefix", "rubix.v1.local", "NATS subject prefix")
	vendor := flag.String("vendor", "nube", "Plugin vendor")
	pluginName := flag.String("name", "taskmanager", "Plugin name")
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

	// Connect to NATS.
	nc, err := natslib.Connect(*natsURL)
	if err != nil {
		logger.Fatal().Err(err).Msg("failed to connect to NATS")
	}
	defer nc.Close()
	logger.Info().Msg("connected to NATS")

	// Create the plugindata client — rubix already applied migrations.json before
	// starting this binary, so tables are guaranteed to exist.
	pluginID := fmt.Sprintf("%s.%s", *vendor, *pluginName)
	ds := datastore.NewClient(nc, *prefix, *orgID, *deviceID, pluginID)

	// Node factory — captures ds in closure so each node instance shares the client.
	factory := func(nodeType string) pluginnode.PluginNode {
		switch nodeType {
		case "nube.taskmanager":
			return node.NewTaskManagerNode(ds)
		default:
			return nil
		}
	}

	// Start the plugin server (health + control + node RPC).
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

	logger.Info().Msg("task manager plugin started — listening for health, control and node RPC")

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)
	<-sigCh
	logger.Info().Msg("shutdown signal received")
}
