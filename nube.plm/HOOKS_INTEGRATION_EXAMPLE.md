# PLM Plugin - Node Hooks Integration Example

## How to integrate node hooks into main.go

### Step 1: Add HTTP server alongside NATS

```go
package main

import (
    "flag"
    "net/http"
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
    httpPort := flag.String("port", "9001", "HTTP server port for hooks")  // NEW
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
        Str("httpPort", *httpPort).  // NEW
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

    // Start the plugin server (NATS)
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

    // NEW: Setup HTTP server for node hooks
    plmHooks := hooks.NewPLMNodeHooks()
    hookHandler := nodehooks.NewHTTPHandler(plmHooks)

    mux := http.NewServeMux()
    hookHandler.RegisterRoutes(mux, "/hooks/nodes")

    // Health check endpoint
    mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
        w.WriteHeader(http.StatusOK)
        w.Write([]byte("OK"))
    })

    httpServer := &http.Server{
        Addr:    ":" + *httpPort,
        Handler: mux,
    }

    // Start HTTP server in background
    go func() {
        logger.Info().Str("port", *httpPort).Msg("HTTP server started")
        if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            logger.Fatal().Err(err).Msg("HTTP server failed")
        }
    }()

    logger.Info().Msg("PLM plugin started — product nodes ready")

    // Wait for shutdown signal
    sigCh := make(chan os.Signal, 1)
    signal.Notify(sigCh, os.Interrupt, syscall.SIGTERM)
    <-sigCh
    logger.Info().Msg("shutdown signal received")

    // Graceful shutdown of HTTP server
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()
    if err := httpServer.Shutdown(ctx); err != nil {
        logger.Error().Err(err).Msg("HTTP server shutdown failed")
    }
}
```

### Step 2: Update plugin.json

```json
{
  "id": "nube.plm",
  "vendor": "nubeio",
  "name": "plm",
  "displayName": "Product Lifecycle Management",
  "version": "1.0.0",
  "description": "Manage products, projects, and tasks",
  "icon": "📦",
  "color": "#3b82f6",

  "policy": {
    "nodeTypes": ["plm.product", "plm.project", "plm.task"],
    "hooks": {
      "enabled": true,
      "endpoint": "/hooks/nodes",
      "timeout": "5s",
      "create": {
        "enabled": true,
        "beforeCreate": true,
        "afterCreate": true
      },
      "update": {
        "enabled": true,
        "beforeUpdate": true,
        "afterUpdate": true
      },
      "delete": {
        "enabled": true,
        "beforeDelete": true,
        "afterDelete": true
      }
    }
  },

  "palette": [
    {
      "type": "plm.product",
      "category": "plm",
      "displayName": "Product",
      "description": "Product definition with lifecycle tracking",
      "icon": "📦",
      "color": "#3b82f6"
    }
  ],

  "widgets": [...]
}
```

### Step 3: Test the hooks

```bash
# Start the plugin
./nube.plm --nats nats://localhost:4222 --org test --device dev1 --port 9001

# Test beforeCreate hook
curl -X POST http://localhost:9001/hooks/nodes/before-create \
  -H "Content-Type: application/json" \
  -d '{
    "node": {
      "id": "node-123",
      "type": "plm.product",
      "name": "Widget Pro",
      "settings": {
        "productCode": "WP-001",
        "status": "Design",
        "price": 250.00
      }
    },
    "userId": "user-456",
    "orgId": "test"
  }'

# Expected response:
{
  "allow": true,
  "warnings": []
}

# Test validation failure
curl -X POST http://localhost:9001/hooks/nodes/before-create \
  -H "Content-Type: application/json" \
  -d '{
    "node": {
      "id": "node-124",
      "type": "plm.product",
      "name": "Invalid Product",
      "settings": {
        "price": -10.00
      }
    },
    "userId": "user-456",
    "orgId": "test"
  }'

# Expected response:
{
  "allow": false,
  "reason": "productCode is required for plm.product nodes"
}
```

## Available Endpoints

Once integrated, your plugin will expose:

- `POST /hooks/nodes/before-create` - Validate before node creation
- `POST /hooks/nodes/after-create` - React to successful creation
- `POST /hooks/nodes/before-update` - Validate before node update
- `POST /hooks/nodes/after-update` - React to successful update
- `POST /hooks/nodes/before-delete` - Validate before node deletion
- `POST /hooks/nodes/after-delete` - React to successful deletion
- `GET /health` - Health check

## Flow

```
1. User creates plm.product in Rubix UI
      ↓
2. Rubix NodeService.Create() validates schema
      ↓
3. Rubix calls: POST http://localhost:9001/hooks/nodes/before-create
      ↓
4. PLM plugin validates business rules
      - Checks productCode is set
      - Validates status enum
      - Checks price >= 0
      ↓
5. Returns { "allow": true } or { "allow": false, "reason": "..." }
      ↓
6. Rubix saves to DB (if allowed)
      ↓
7. Rubix calls: POST http://localhost:9001/hooks/nodes/after-create
      ↓
8. PLM plugin logs creation, sends notifications, etc.
```

## Benefits

✅ **Shared Code** - All plugins use `github.com/NubeIO/rubix-plugin/nodehooks`
✅ **Type Safety** - Structured request/response types
✅ **Easy Testing** - Standard HTTP endpoints
✅ **Flexible** - Enable/disable hooks via plugin.json
✅ **Non-Breaking** - Existing plugins work without changes
