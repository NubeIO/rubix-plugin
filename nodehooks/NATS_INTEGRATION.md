# Node Hooks - NATS Integration

## ✅ Complete Implementation

All node CRUD hooks now use **100% NATS messaging** - no HTTP/REST.

## Architecture

```
┌─────────────────┐                    ┌──────────────────┐
│  Rubix Core     │                    │  PLM Plugin      │
│  NodeService    │                    │  (nube.plm)      │
└────────┬────────┘                    └────────┬─────────┘
         │                                      │
         │ NATS Request                         │ NATS Subscribe
         │ (JSON payload)                       │ (JSON response)
         │                                      │
         │   rubix.v1.local.test.device0       │
         │   .plugin.nube.plm.hooks            │
         │   .before-create                     │
         ├──────────────────────────────────────►
         │                                      │
         │   {                                  │
         │     "node": {                        │
         │       "type": "plm.product",         │
         │       "settings": {...}              │
         │     }                                │
         │   }                                  │
         │                                      │
         │◄──────────────────────────────────────
         │                                      │
         │   {                                  │
         │     "allow": true/false,             │
         │     "reason": "...",                 │
         │     "modified": {...}                │
         │   }                                  │
         │                                      │
```

## NATS Subject Pattern

```
{prefix}.{orgId}.{deviceId}.plugin.{vendor}.{name}.hooks.{operation}
```

### Examples

| Operation | Subject |
|-----------|---------|
| Before Create | `rubix.v1.local.test.device0.plugin.nube.plm.hooks.before-create` |
| After Create | `rubix.v1.local.test.device0.plugin.nube.plm.hooks.after-create` |
| Before Update | `rubix.v1.local.test.device0.plugin.nube.plm.hooks.before-update` |
| After Update | `rubix.v1.local.test.device0.plugin.nube.plm.hooks.after-update` |
| Before Delete | `rubix.v1.local.test.device0.plugin.nube.plm.hooks.before-delete` |
| After Delete | `rubix.v1.local.test.device0.plugin.nube.plm.hooks.after-delete` |

## Files Created

### Common Library (All plugins can use)

```
/home/user/code/go/nube/rubix-plugin/nodehooks/
├── interface.go      # NodeHooks interface + NoOpHooks
├── types.go          # Request/Response types
├── subjects.go       # NATS subject builder
├── handler.go        # NATS message handlers
├── README.md         # Full documentation
└── NATS_INTEGRATION.md  # This file
```

### PLM Plugin Implementation

```
/home/user/code/go/nube/rubix-plugin/nube.plm/
├── internal/hooks/
│   └── node_hooks.go       # PLM-specific validation logic
└── main.go                 # Integrated hooks via NATS
```

## How It Works

### 1. Plugin Registers Hooks (NATS Subscribe)

```go
// main.go
func main() {
    // Connect to NATS
    nc, err := natslib.Connect(natsURL)

    // Create hooks
    plmHooks := hooks.NewPLMNodeHooks()

    // Build NATS subjects
    hookSubjects := nodehooks.NewSubjectBuilder(
        "rubix.v1.local",  // prefix
        "test",             // orgID
        "device0",          // deviceID
        "nube",             // vendor
        "plm",              // pluginName
    )

    // Register all hooks via NATS
    hookHandler := nodehooks.NewNATSHandler(plmHooks, nc, hookSubjects)
    hookHandler.RegisterAll()  // Subscribes to all 6 subjects

    // Plugin is now ready to receive hook calls
}
```

### 2. Rubix Calls Hook (NATS Request)

```go
// internal/business/nodes/service.go (future implementation)
func (s *NodeService) Create(ctx, node) (*Node, error) {
    // 1. Validate schema
    s.validator.ValidateCreate(ctx, node)

    // 2. Call plugin beforeCreate hook via NATS
    subject := buildHookSubject(node.PluginID, "before-create")
    request := BeforeCreateRequest{Node: node}

    respData, err := s.nats.Request(subject, json.Marshal(request), 5*time.Second)

    var resp BeforeCreateResponse
    json.Unmarshal(respData, &resp)

    if !resp.Allow {
        return nil, fmt.Errorf("plugin blocked: %s", resp.Reason)
    }

    // 3. Save to DB
    s.repo.CreateNode(ctx, node)

    // 4. Call afterCreate (fire and forget)
    s.nats.Publish(buildHookSubject(node.PluginID, "after-create"), ...)
}
```

### 3. Plugin Validates (Hook Implementation)

```go
// internal/hooks/node_hooks.go
func (h *PLMNodeHooks) BeforeCreate(ctx, req) (*Response, error) {
    if req.Node.Type == "plm.product" {
        // Validate product code exists
        productCode := req.Node.Settings["productCode"]
        if productCode == "" {
            return &Response{
                Allow: false,
                Reason: "productCode is required",
            }, nil
        }

        // Check uniqueness (future: query DB)
        // ...
    }

    return &Response{Allow: true}, nil
}
```

## Message Flow

### Create Product Example

```
1. User → Rubix API: POST /api/v1/orgs/test/devices/device0/nodes
   {
     "type": "plm.product",
     "name": "Widget Pro",
     "settings": {"productCode": "WP-001", "price": 250}
   }

2. Rubix → NATS: Request to plugin
   Subject: rubix.v1.local.test.device0.plugin.nube.plm.hooks.before-create
   Payload: {"node": {...}, "userId": "...", "orgId": "test"}

3. PLM Plugin → Validates
   - Check productCode exists: ✓
   - Check price >= 0: ✓
   - Check status enum: ✓

4. PLM Plugin → NATS: Response
   Payload: {"allow": true}

5. Rubix → DB: INSERT INTO nodes (...)

6. Rubix → NATS: Publish (fire and forget)
   Subject: rubix.v1.local.test.device0.plugin.nube.plm.hooks.after-create
   Payload: {"node": {...}, "orgId": "test"}

7. PLM Plugin → Logs creation
   - Send notification
   - Update search index
   - etc.

8. Rubix → User: 201 Created
```

## Benefits of NATS Approach

| Benefit | Description |
|---------|-------------|
| ✅ **Fast** | NATS is extremely fast (microsecond latency) |
| ✅ **Reliable** | Request/reply pattern with timeouts |
| ✅ **Consistent** | Same transport as rest of plugin system |
| ✅ **No Ports** | No need to manage HTTP ports per plugin |
| ✅ **Scalable** | Can run plugins on different machines |
| ✅ **Observable** | Can monitor NATS subjects for debugging |

## Testing Hooks

### Manual Test (NATS CLI)

```bash
# Subscribe to see hook calls
nats sub "rubix.v1.local.test.device0.plugin.nube.plm.hooks.>"

# Simulate a beforeCreate call
nats request rubix.v1.local.test.device0.plugin.nube.plm.hooks.before-create '{
  "node": {
    "type": "plm.product",
    "settings": {"productCode": "TEST-001"}
  },
  "orgId": "test"
}'

# Expected response:
{"allow": true}
```

### Integration Test

```go
func TestBeforeCreateHook(t *testing.T) {
    // Connect to NATS
    nc, _ := natslib.Connect("nats://localhost:4222")

    // Send request
    req := BeforeCreateRequest{
        Node: Node{
            Type: "plm.product",
            Settings: map[string]any{
                "productCode": "TEST-001",
            },
        },
    }

    respData, err := nc.Request(
        "rubix.v1.local.test.device0.plugin.nube.plm.hooks.before-create",
        json.Marshal(req),
        5*time.Second,
    )

    var resp BeforeCreateResponse
    json.Unmarshal(respData, &resp)

    assert.True(t, resp.Allow)
}
```

## Next Steps

1. ✅ Common NATS-based hook library created
2. ✅ PLM plugin integrated with hooks
3. ⏳ Add hook caller in Rubix NodeService
4. ⏳ Update plugin.json with policy config
5. ⏳ Add full CRUD to PLM widget (edit/delete)

## Files Modified

| File | Change |
|------|--------|
| `nodehooks/subjects.go` | NEW - NATS subject builder |
| `nodehooks/handler.go` | UPDATED - NATS handlers (was HTTP) |
| `nodehooks/interface.go` | SAME - Interface unchanged |
| `nodehooks/types.go` | SAME - Types unchanged |
| `nube.plm/main.go` | UPDATED - Register hooks via NATS |
| `nube.plm/internal/hooks/node_hooks.go` | NEW - PLM validation |
| `natslib/helpers.go` | FIXED - Import path (NubeDev → NubeIO) |
| `nube.plm/go.mod` | FIXED - Module name consistency |

## Plugin Deployed

```
✅ Built: /home/user/code/go/nube/rubix-plugin/nube.plm/nube.plm
✅ Installed: /home/user/code/go/nube/rubix/bin/dev/orgs/test/plugins/nube.plm/
✅ Frontend: 13 files copied
✅ Ready: Restart rubix to load plugin with hooks
```

## NATS Advantages for Hooks

1. **No Port Management** - Plugins don't need separate HTTP ports
2. **Same Connection** - Reuse existing NATS connection for nodes
3. **Request/Reply** - Built-in timeout and error handling
4. **Pub/Sub** - After-hooks can be fire-and-forget
5. **Multi-Org** - Subject pattern naturally supports multi-tenancy
6. **Monitoring** - Can use `nats sub` to debug hook calls
7. **Performance** - Microsecond latency, handles millions of msgs/sec
