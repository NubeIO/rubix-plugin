# Node Hooks - Common Library Structure

## 📁 Package Location

```
/home/user/code/go/nube/rubix-plugin/
├── nodehooks/                    ← NEW COMMON LIBRARY
│   ├── README.md                 ← Full documentation
│   ├── STRUCTURE.md              ← This file
│   ├── interface.go              ← NodeHooks interface + NoOpHooks
│   ├── types.go                  ← Request/Response types
│   └── handler.go                ← HTTP handlers for plugins
│
├── plugin/                       ← Existing common lib
├── pluginnode/                   ← Existing common lib
├── natslib/                      ← Existing common lib
├── widgetsettings/               ← Existing common lib
│
├── nube.plm/                     ← PLM Plugin
│   ├── internal/
│   │   └── hooks/
│   │       └── node_hooks.go     ← PLM hook implementation (EXAMPLE)
│   ├── HOOKS_INTEGRATION_EXAMPLE.md
│   └── main.go
│
├── nubeio-example/               ← Example Plugin
├── nubeio-taskmanager/           ← Task Manager Plugin
└── go.mod                        ← Root module
```

## 📦 Import Path

```go
import "github.com/NubeIO/rubix-plugin/nodehooks"
```

All plugins in `/home/user/code/go/nube/rubix-plugin/` automatically have access.

## 🔗 How It Works

### 1. Common Library (Shared by ALL plugins)

```
github.com/NubeIO/rubix-plugin/nodehooks
├── interface.go     → NodeHooks interface
├── types.go         → BeforeCreateRequest, BeforeCreateResponse, etc.
├── handler.go       → HTTP handlers (NewHTTPHandler, RegisterRoutes)
└── README.md        → Full docs with examples
```

### 2. Plugin Implementation (Each plugin)

```go
// nube.plm/internal/hooks/node_hooks.go
package hooks

import "github.com/NubeIO/rubix-plugin/nodehooks"

type PLMNodeHooks struct {
    nodehooks.NoOpHooks  // Default implementations
}

func (h *PLMNodeHooks) BeforeCreate(ctx, req) (*Response, error) {
    // Validate PLM-specific business rules
    if req.Node.Type == "plm.product" {
        // Check product code exists
        // Validate status enum
        // Validate price >= 0
    }
    return &Response{Allow: true}, nil
}
```

### 3. HTTP Server (Each plugin)

```go
// nube.plm/main.go
func main() {
    // ... NATS setup ...

    // Setup hooks
    plmHooks := hooks.NewPLMNodeHooks()
    hookHandler := nodehooks.NewHTTPHandler(plmHooks)

    mux := http.NewServeMux()
    hookHandler.RegisterRoutes(mux, "/hooks/nodes")

    http.ListenAndServe(":9001", mux)
}
```

### 4. Rubix Integration (Core)

```go
// internal/business/nodes/service.go
func (s *NodeService) Create(ctx, input) (*Node, error) {
    // 1. Validate schema
    if err := s.validator.ValidateCreate(ctx, node); err != nil {
        return nil, err
    }

    // 2. Call plugin hook
    if node.PluginID != "" {
        resp, err := s.pluginHooks.CallBeforeCreate(ctx, node, userID)
        if err != nil || !resp.Allow {
            return nil, fmt.Errorf("plugin blocked: %s", resp.Reason)
        }
    }

    // 3. Save to DB
    if err := s.repo.CreateNode(ctx, node); err != nil {
        return nil, err
    }

    // 4. Call after hook (best-effort)
    s.pluginHooks.CallAfterCreate(ctx, node)

    return node, nil
}
```

## 🚀 Usage Flow

```
┌─────────────────────────────────────────────────────────────────┐
│ User creates plm.product via Rubix API                          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Rubix: NodeService.Create()                                     │
│   - Validate JSON schema                                        │
│   - Check palette exists                                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ Rubix: Call plugin hook                                         │
│   POST http://localhost:9001/hooks/nodes/before-create          │
│   {                                                             │
│     "node": {                                                   │
│       "type": "plm.product",                                    │
│       "settings": { "productCode": "WP-001", ... }              │
│     }                                                           │
│   }                                                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│ PLM Plugin: node_hooks.go                                       │
│   - Validate productCode is set                                 │
│   - Check productCode is unique (DB query)                      │
│   - Validate status enum                                        │
│   - Validate price >= 0                                         │
│   → Return { "allow": true } or { "allow": false, "reason" }    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                    ┌────┴────┐
                    │ Allowed? │
                    └─┬─────┬─┘
              Yes ◄──┘     └──► No
                 │              │
                 ▼              ▼
    ┌─────────────────┐   ┌──────────────────┐
    │ Rubix: Save DB  │   │ Return 400 error │
    └────────┬────────┘   └──────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ Rubix: Call after-create hook       │
    │ (best-effort, errors logged)        │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ PLM Plugin: Log creation            │
    │  - Send notification                │
    │  - Update search index              │
    │  - Trigger workflows                │
    └────────┬────────────────────────────┘
             │
             ▼
    ┌─────────────────────────────────────┐
    │ Return success to user              │
    └─────────────────────────────────────┘
```

## 📋 API Reference

### Endpoints (exposed by each plugin)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/hooks/nodes/before-create` | POST | Validate before creation (blocking) |
| `/hooks/nodes/after-create` | POST | React to successful creation |
| `/hooks/nodes/before-update` | POST | Validate before update (blocking) |
| `/hooks/nodes/after-update` | POST | React to successful update |
| `/hooks/nodes/before-delete` | POST | Validate before deletion (blocking) |
| `/hooks/nodes/after-delete` | POST | React to successful deletion |

### Request Types

```go
type BeforeCreateRequest struct {
    Node    Node           `json:"node"`
    UserID  string         `json:"userId,omitempty"`
    OrgID   string         `json:"orgId"`
    Context map[string]any `json:"context,omitempty"`
}

type BeforeCreateResponse struct {
    Allow    bool     `json:"allow"`              // false = block
    Reason   string   `json:"reason,omitempty"`   // Why blocked
    Modified *Node    `json:"modified,omitempty"` // Transform node
    Warnings []string `json:"warnings,omitempty"` // Non-blocking
}
```

## 🎯 Benefits

| Benefit | Description |
|---------|-------------|
| **✅ Shared Code** | All plugins import same library |
| **✅ Type Safety** | Structured types, no string parsing |
| **✅ Easy Testing** | Standard HTTP + JSON |
| **✅ Flexible** | Enable/disable per operation |
| **✅ Non-Breaking** | Existing plugins unaffected |
| **✅ RxAI Ready** | Core logic in `internal/business/nodes` |

## 📝 Example Implementations

### Simple Validation
```go
func (h *Hooks) BeforeCreate(ctx, req) (*Response, error) {
    if req.Node.Settings["code"] == "" {
        return &Response{
            Allow: false,
            Reason: "code is required",
        }, nil
    }
    return &Response{Allow: true}, nil
}
```

### Transform Node
```go
func (h *Hooks) BeforeCreate(ctx, req) (*Response, error) {
    node := req.Node
    if node.Settings["status"] == nil {
        node.Settings["status"] = "draft"  // Default
        return &Response{
            Allow: true,
            Modified: &node,
        }, nil
    }
    return &Response{Allow: true}, nil
}
```

### Database Check
```go
func (h *Hooks) BeforeCreate(ctx, req) (*Response, error) {
    code := req.Node.Settings["code"].(string)
    exists, err := h.db.Exists(ctx, code)
    if err != nil {
        return nil, err  // Block with error
    }
    if exists {
        return &Response{
            Allow: false,
            Reason: "code already exists",
        }, nil
    }
    return &Response{Allow: true}, nil
}
```

## 🔧 Next Steps

1. ✅ Common library created at `/home/user/code/go/nube/rubix-plugin/nodehooks`
2. ✅ Example implementation in PLM plugin
3. ⏳ Add HTTP server to PLM plugin main.go
4. ⏳ Update plugin.json with policy config
5. ⏳ Add plugin hook caller in rubix `internal/business/nodes`
6. ⏳ Update NodeService.Create/Update/Delete to call hooks
7. ⏳ Add plugin registry/discovery for hook endpoints

## 📚 Documentation

- [README.md](README.md) - Full usage guide with examples
- [STRUCTURE.md](STRUCTURE.md) - This file
- [interface.go](interface.go) - API reference
- [nube.plm/HOOKS_INTEGRATION_EXAMPLE.md](../nube.plm/HOOKS_INTEGRATION_EXAMPLE.md) - Integration example
