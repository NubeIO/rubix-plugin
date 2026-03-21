package main

import (
	"context"
	"flag"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	plmBootstrap "github.com/NubeIO/rubix-plm-plugin/internal/bootstrap"
	"github.com/NubeIO/rubix-plm-plugin/internal/hooks"
	"github.com/NubeIO/rubix-plm-plugin/internal/nodes"
	"github.com/NubeIO/rubix-plugin/bootstrap"
	"github.com/NubeIO/rubix-plugin/natslib"
	"github.com/NubeIO/rubix-plugin/natssubject"
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

	// Register node CRUD hooks via NATS FIRST (before bootstrap)
	// This is required because bootstrap creates nodes, which triggers hooks
	logger.Info().Msg("registering node hooks...")
	plmHooks := hooks.NewPLMNodeHooks()
	hookSubjects := nodehooks.NewSubjectBuilder(*prefix, *orgID, *deviceID, *vendor, *pluginName)
	hookHandler := nodehooks.NewNATSHandler(plmHooks, nc, hookSubjects)
	if err := hookHandler.RegisterAll(); err != nil {
		logger.Fatal().Err(err).Msg("failed to register node hooks")
	}
	defer hookHandler.Unsubscribe()

	// Node factory
	factory := func(nodeType string) pluginnode.PluginNode {
		switch nodeType {
		case "plm.service":
			return &nodes.PLMServiceNode{}
		case "plm.products":
			return &nodes.ProductsCollectionNode{}
		case "plm.product":
			return &nodes.ProductNode{}
		default:
			return nil
		}
	}

	// Start the plugin server BEFORE bootstrap
	// This ensures RPC handlers are ready when bootstrap creates nodes (which may trigger hooks/RPC)
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

	logger.Info().Msg("plugin server started — ready to handle RPC and hooks")

	// Bootstrap PLM hierarchy (service + collections)
	// Use "*" for flowId because nodes endpoints don't include flowId in their URL path
	// RAS routing expects: rubix.v1.{scope}.{orgId}.{deviceId}.*.nodes.create
	sb := natssubject.NewBuilder(*prefix, *orgID, *deviceID, "*")
	bootstrapClient := &bootstrap.Client{
		NC:      nc,
		Subject: sb,
	}

	// Wait for rubix core to be ready, then bootstrap hierarchy
	logger.Info().Msg("waiting for rubix core to be ready...")

	retryCallback := func(attempt int, nextDelay time.Duration) {
		logger.Info().
			Int("attempt", attempt).
			Str("nextRetry", nextDelay.String()).
			Msg("rubix core not ready, retrying...")
	}

	// Wait up to 5 minutes for server (0 = wait forever)
	maxWait := 5 * time.Minute

	// Construct plugin node ID (pattern: plugin_{vendor}.{name})
	// This is the auto-created node that represents this plugin in the tree
	pluginNodeID := fmt.Sprintf("plugin_%s.%s", *vendor, *pluginName)
	logger.Info().Str("pluginNodeId", pluginNodeID).Msg("plugin node ID")

	logger.Info().Msg("bootstrapping PLM hierarchy...")
	ctx, cancel := context.WithTimeout(context.Background(), maxWait+30*time.Second)
	defer cancel()

	hierarchyIDs, err := plmBootstrap.EnsurePLMHierarchyWithRetry(ctx, bootstrapClient, pluginNodeID, maxWait, retryCallback)
	if err != nil {
		logger.Error().Err(err).Msg("failed to bootstrap PLM hierarchy - plugin will start but nodes may not be initialized")
	} else {
		logger.Info().
			Str("serviceId", hierarchyIDs["service"]).
			Str("productsId", hierarchyIDs["products"]).
			Msg("✅ PLM hierarchy ready")
	}

	logger.Info().Msg("PLM plugin started — product nodes ready + CRUD hooks active")

	// Wait for shutdown signal
	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)
	<-sigCh
	logger.Info().Msg("shutdown signal received")
}
