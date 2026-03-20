# PLM Plugin - Architecture Review & Integration Plan

## ✅ Current Architecture (CORRECT)

### Frontend → Widget Communication

```
User Browser (localhost:3000)
    ↓
Plugin Widget Component
    ↓ (receives props from frontend)
{
  orgId: "test"
  deviceId: "dev_970455D0F01F"
  token: "<JWT from localStorage>"
  baseUrl: "/api/v1"  ← RELATIVE PATH (correct!)
  config: {...}
  api: {...}
}
    ↓
Widget makes request: fetch(`${baseUrl}/${orgId}/${deviceId}/query`)
    = fetch("/api/v1/test/dev_970455D0F01F/query")
    ↓
Vite Dev Server (localhost:3000) proxies /api → localhost:9000
    ↓
Rubix Backend API (localhost:9000)
```

**This is CORRECT architecture:**
- ✅ Widget receives props from frontend (NOT hardcoded)
- ✅ No auth logic in widget (uses token from frontend)
- ✅ No server URLs in widget (uses relative baseUrl)
- ✅ Vite proxy handles routing to backend

### Files Reviewed

| File | Status | Notes |
|------|--------|-------|
| `frontend/src/features/.../plugin-widget.tsx` | ✅ CORRECT | Passes props correctly |
| `frontend/vite.config.ts` | ✅ CORRECT | Proxy configured for `/api` → port 9000 |
| `nube.plm/frontend/src/widgets/ProductTableWidget.tsx` | ✅ CORRECT | Uses props (no hardcoded values) |
| `nube.plm/main.go` | ✅ CORRECT | NATS hooks registered |
| `rubix-plugin/nodehooks/` | ✅ CORRECT | Common NATS-based library |

## 🎯 What We Built

### A) Common NATS Hook Library

**Location**: `/home/user/code/go/nube/rubix-plugin/nodehooks/`

```
nodehooks/
├── interface.go    # NodeHooks interface + NoOpHooks
├── types.go        # BeforeCreate/Update/DeleteRequest/Response
├── subjects.go     # NATS subject builder
├── handler.go      # NATS message handlers
├── README.md       # Full documentation
└── NATS_INTEGRATION.md  # Architecture guide
```

**Import**: `github.com/NubeIO/rubix-plugin/nodehooks`

**Usage Pattern**:
```go
// 1. Plugin implements hooks
type PLMNodeHooks struct {
    nodehooks.NoOpHooks  // Default implementations
}

func (h *PLMNodeHooks) BeforeCreate(ctx, req) (*Response, error) {
    // Validate product code, price, status
    if req.Node.Settings["productCode"] == "" {
        return &Response{
            Allow: false,
            Reason: "productCode is required",
        }, nil
    }
    return &Response{Allow: true}, nil
}

// 2. Plugin registers hooks via NATS
plmHooks := hooks.NewPLMNodeHooks()
hookSubjects := nodehooks.NewSubjectBuilder(prefix, orgID, deviceID, vendor, pluginName)
hookHandler := nodehooks.NewNATSHandler(plmHooks, nc, hookSubjects)
hookHandler.RegisterAll()  // Subscribes to NATS subjects
```

### B) Full CRUD Widget

**Location**: `nube.plm/frontend/src/widgets/ProductTableWidget.tsx`

**Features**:
- ✅ Create: "New Product" button → Dialog → POST /nodes
- ✅ Read: Query products via POST /query
- ✅ Update: Edit button → Dialog → PUT /nodes/{id}
- ✅ Delete: Delete button → Confirmation → DELETE /nodes/{id}

**Props Received** (from frontend):
```tsx
interface ProductTableWidgetProps {
  orgId?: string;          // From frontend router
  deviceId?: string;       // From frontend router
  baseUrl?: string;        // '/api/v1' (relative, proxied)
  token?: string;          // From localStorage
  settings?: WidgetSettings;  // User configuration
  config?: Record<string, unknown>;
}
```

**API Calls**:
```typescript
// Query products
POST ${baseUrl}/${orgId}/${deviceId}/query
Body: {"filter": "type is \"plm.product\""}

// Create product
POST ${baseUrl}/${orgId}/${deviceId}/nodes
Body: {type: "plm.product", name: "...", settings: {...}}

// Update product
PUT ${baseUrl}/${orgId}/${deviceId}/nodes/${id}
Body: {name: "...", settings: {...}}

// Delete product
DELETE ${baseUrl}/${orgId}/${deviceId}/nodes/${id}
```

## 🔧 Current State

### What's Working ✅

1. **Frontend Architecture**
   - ✅ Plugin widget receives props from frontend
   - ✅ No hardcoded auth or server URLs
   - ✅ Vite proxy configured correctly
   - ✅ Widget uses relative API paths

2. **Backend Architecture**
   - ✅ NATS hook library created (`nodehooks/`)
   - ✅ PLM plugin implements hooks
   - ✅ Hooks registered via NATS subscriptions
   - ✅ Validation logic in place

3. **Widget Features**
   - ✅ Full CRUD UI implemented
   - ✅ Create/Edit/Delete dialogs
   - ✅ Form validation
   - ✅ Error handling
   - ✅ Auto-refresh after mutations

### What's NOT Integrated Yet ⏳

1. **Rubix Core → NATS Hook Integration**
   - ⏳ NodeService doesn't call plugin hooks yet
   - ⏳ Need to add hook caller in `internal/business/nodes/service.go`
   - ⏳ Need plugin registry/discovery for hook endpoints

2. **Widget Testing**
   - ⏳ Need to create test product
   - ⏳ Need to verify CRUD operations work end-to-end
   - ⏳ Need to test hook validation

## 📋 Integration Plan

### Phase 1: Test Current Widget (NO HOOKS)

**Goal**: Verify widget CRUD works without plugin hooks

**Steps**:
1. ✅ Widget is deployed and accessible
2. ⏳ Refresh browser to load updated widget
3. ⏳ Create a test product via widget
4. ⏳ Verify product appears in table
5. ⏳ Test edit and delete

**Commands**:
```bash
# Widget is already built and deployed at:
# /home/user/code/go/nube/rubix/bin/dev/orgs/test/plugins/nube.plm/

# Just refresh browser (Ctrl+R or Cmd+R)
# Widget should work without hooks (no validation yet)
```

### Phase 2: Add Rubix Core Hook Integration

**Goal**: Make Rubix NodeService call plugin hooks via NATS

**Files to Modify**:
```
internal/business/nodes/
├── service.go           # Add hook caller
├── plugin_hooks.go      # NEW - Plugin hook manager
└── policy.go            # NEW - Policy types

internal/models/
└── plugin.go            # Add Policy field to PluginMetadata
```

**Implementation**:

**2.1. Add Plugin Registry Interface**

```go
// internal/business/nodes/plugin_registry.go
package nodes

type PluginRegistry interface {
    GetPluginByNodeType(nodeType string) (*PluginMetadata, error)
    GetPluginEndpoint(orgID, pluginID string) (string, error)
}

type PluginMetadata struct {
    ID       string
    Vendor   string
    Name     string
    Policy   *CRUDPolicy  // NEW
}

type CRUDPolicy struct {
    NodeTypes []string
    Hooks     *HooksConfig
}

type HooksConfig struct {
    Enabled   bool
    Endpoint  string  // NATS subject prefix
    Create    *OperationHooks
    Update    *OperationHooks
    Delete    *OperationHooks
}

type OperationHooks struct {
    Enabled       bool
    BeforeHook    bool
    AfterHook     bool
}
```

**2.2. Add NATS Hook Manager**

```go
// internal/business/nodes/plugin_hooks.go
package nodes

import (
    "context"
    "encoding/json"
    "time"

    "github.com/nats-io/nats.go"
)

type PluginHookManager struct {
    nc       *nats.Conn
    registry PluginRegistry
}

func NewPluginHookManager(nc *nats.Conn, registry PluginRegistry) *PluginHookManager {
    return &PluginHookManager{
        nc:       nc,
        registry: registry,
    }
}

func (m *PluginHookManager) CallBeforeCreate(ctx context.Context, node *models.Node, userID string) (*BeforeCreateResponse, error) {
    // 1. Get plugin for this node type
    plugin, err := m.registry.GetPluginByNodeType(node.Type)
    if err != nil || plugin == nil {
        return &BeforeCreateResponse{Allow: true}, nil  // No plugin, allow
    }

    // 2. Check if hooks enabled
    if plugin.Policy == nil || !plugin.Policy.Hooks.Enabled || !plugin.Policy.Hooks.Create.BeforeHook {
        return &BeforeCreateResponse{Allow: true}, nil
    }

    // 3. Build NATS subject
    // Pattern: rubix.v1.local.{org}.{device}.plugin.{vendor}.{name}.hooks.before-create
    subject := fmt.Sprintf("rubix.v1.local.%s.%s.plugin.%s.%s.hooks.before-create",
        node.OrgID, getDeviceID(), plugin.Vendor, plugin.Name)

    // 4. Build request
    req := BeforeCreateRequest{
        Node: NodeDTO{
            ID:       node.ID,
            Type:     node.Type,
            Name:     node.Name,
            Settings: node.Settings,
            PluginID: plugin.ID,
        },
        UserID: userID,
        OrgID:  node.OrgID,
    }

    reqData, _ := json.Marshal(req)

    // 5. Call via NATS (request/reply with timeout)
    msg, err := m.nc.Request(subject, reqData, 5*time.Second)
    if err != nil {
        return nil, fmt.Errorf("hook timeout or error: %w", err)
    }

    // 6. Parse response
    var resp BeforeCreateResponse
    if err := json.Unmarshal(msg.Data, &resp); err != nil {
        return nil, fmt.Errorf("invalid hook response: %w", err)
    }

    return &resp, nil
}

// Similar for CallBeforeUpdate, CallBeforeDelete, CallAfterCreate, etc.
```

**2.3. Update NodeService**

```go
// internal/business/nodes/service.go

type NodeService struct {
    repo           repository.Repository
    validator      *NodeValidator
    specialHandler *SpecialNodeHandler
    runtimeMgr     RuntimeManager
    pluginHooks    *PluginHookManager  // NEW
}

func (s *NodeService) Create(ctx context.Context, input CreateNodeInput) (*models.Node, error) {
    node := input.Node

    // 1. Existing validation
    if err := s.validator.ValidateCreate(ctx, node, input.AllowUnknown); err != nil {
        return nil, err
    }

    // 2. NEW - Call plugin beforeCreate hook
    if s.pluginHooks != nil {
        hookResp, err := s.pluginHooks.CallBeforeCreate(ctx, node, input.UserID)
        if err != nil {
            return nil, fmt.Errorf("plugin hook error: %w", err)
        }

        if !hookResp.Allow {
            return nil, &ValidationError{
                Field:   "plugin",
                Message: hookResp.Reason,
            }
        }

        // Apply modifications if plugin transformed the node
        if hookResp.Modified != nil {
            node.Name = hookResp.Modified.Name
            node.Settings = hookResp.Modified.Settings
        }

        // Log warnings
        for _, warning := range hookResp.Warnings {
            log.Warn().Str("nodeType", node.Type).Msg(warning)
        }
    }

    return node, nil
}

func (s *NodeService) PostCreateHook(node models.Node) error {
    // Existing runtime update
    if s.runtimeMgr != nil {
        if err := s.runtimeMgr.AddNodeToRuntime(node.OrgID, node); err != nil {
            return err
        }
    }

    // NEW - Call plugin afterCreate (fire and forget)
    if s.pluginHooks != nil {
        go func() {
            if err := s.pluginHooks.CallAfterCreate(context.Background(), &node); err != nil {
                log.Error().Err(err).Str("nodeId", node.ID).Msg("plugin afterCreate failed")
            }
        }()
    }

    return nil
}
```

**2.4. Update Plugin Metadata**

```go
// internal/models/plugin.go

type PluginMetadata struct {
    ID          string
    Vendor      string
    Name        string
    Version     string
    Palette     []PaletteItem
    Widgets     []PluginWidgetDef
    Policy      *PluginPolicy      // NEW
}

type PluginPolicy struct {
    NodeTypes []string
    Hooks     *PluginHooksConfig
}

type PluginHooksConfig struct {
    Enabled   bool
    Endpoint  string
    Timeout   string
    Create    *OperationHooks
    Update    *OperationHooks
    Delete    *OperationHooks
}

type OperationHooks struct {
    Enabled      bool
    BeforeHook   bool
    AfterHook    bool
}
```

**2.5. Update plugin.json Parser**

```go
// plugins_manager/manager.go

func (m *Manager) loadPluginMetadata(pluginPath string) (*models.PluginMetadata, error) {
    // ... existing code ...

    var rawData struct {
        ID          string                      `json:"id"`
        Vendor      string                      `json:"vendor"`
        Name        string                      `json:"name"`
        Version     string                      `json:"version"`
        Palette     []models.PaletteItem        `json:"palette"`
        Widgets     []models.PluginWidgetDef    `json:"widgets"`
        Policy      *models.PluginPolicy        `json:"policy"`  // NEW
    }

    if err := json.Unmarshal(data, &rawData); err != nil {
        return nil, err
    }

    return &models.PluginMetadata{
        ID:      rawData.ID,
        Vendor:  rawData.Vendor,
        Name:    rawData.Name,
        Version: rawData.Version,
        Palette: rawData.Palette,
        Widgets: rawData.Widgets,
        Policy:  rawData.Policy,  // NEW
    }, nil
}
```

### Phase 3: Update PLM plugin.json

**File**: `nube.plm/plugin.json`

```json
{
  "id": "nube.plm",
  "vendor": "nube",
  "name": "plm",
  "displayName": "Product Lifecycle Management",
  "version": "1.0.0",
  "description": "Product management system",
  "category": "manufacturing",
  "nodeTypes": ["plm.product"],

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

  "palette": [...],
  "widgets": [...],
  "execPath": "./nube.plm",
  "args": []
}
```

### Phase 4: End-to-End Testing

**Test Flow**:
```
1. User creates product in widget
      ↓
2. Widget → POST /api/v1/test/dev_xxx/nodes
      ↓
3. Rubix NodeService.Create()
      ↓
4. NodeService → NATS Request (before-create)
   Subject: rubix.v1.local.test.dev_xxx.plugin.nube.plm.hooks.before-create
      ↓
5. PLM Plugin validates via BeforeCreate hook
   - Checks productCode exists
   - Validates price >= 0
   - Validates status enum
      ↓
6. PLM Plugin → NATS Response {"allow": true/false}
      ↓
7. If allowed: Rubix saves to DB
      ↓
8. Rubix → NATS Publish (after-create)
      ↓
9. PLM Plugin logs creation via AfterCreate hook
      ↓
10. Widget refetches → Product appears in table
```

## 📁 File Summary

### Created Files ✅

| File | Purpose | Status |
|------|---------|--------|
| `rubix-plugin/nodehooks/*.go` | Common NATS hook library | ✅ Done |
| `nube.plm/internal/hooks/node_hooks.go` | PLM validation logic | ✅ Done |
| `nube.plm/frontend/src/widgets/ProductTableWidget.tsx` | Full CRUD widget | ✅ Done |
| `nube.plm/main.go` | NATS hooks registration | ✅ Done |

### Files to Create ⏳

| File | Purpose | Status |
|------|---------|--------|
| `internal/business/nodes/plugin_hooks.go` | NATS hook caller | ⏳ TODO |
| `internal/business/nodes/plugin_registry.go` | Plugin metadata interface | ⏳ TODO |
| `internal/models/plugin.go` | Add Policy field | ⏳ TODO |

### Files to Modify ⏳

| File | Change | Status |
|------|--------|--------|
| `internal/business/nodes/service.go` | Add hook calls | ⏳ TODO |
| `plugins_manager/manager.go` | Parse policy from plugin.json | ⏳ TODO |
| `nube.plm/plugin.json` | Add policy config | ⏳ TODO |

## 🎯 Next Immediate Steps

### For Testing Widget (No Hooks)

1. ✅ Widget is deployed
2. **Refresh browser** (Ctrl+R or Cmd+R)
3. Widget should show "No products found"
4. Click "New Product" → Create a product
5. Product should appear in table
6. Test edit and delete

### For Full Integration (With Hooks)

1. Implement Phase 2 (Rubix Core integration)
2. Update plugin.json with policy (Phase 3)
3. Rebuild and deploy
4. Test end-to-end (Phase 4)

## 📝 Summary

**What You Have**:
- ✅ Common NATS hook library (all plugins can use)
- ✅ PLM plugin with validation hooks
- ✅ Full CRUD widget (create/read/update/delete)
- ✅ Correct frontend architecture (props from frontend, no hardcoded auth)

**What You Need**:
- ⏳ Rubix Core integration (NodeService → NATS hooks)
- ⏳ Plugin policy in plugin.json
- ⏳ End-to-end testing

**Architecture is CORRECT**:
- ✅ Widget receives props from frontend (NOT hardcoded)
- ✅ No auth logic in widget
- ✅ Vite proxy configured correctly
- ✅ NATS-based hooks (no HTTP!)

Ready to test the widget and then integrate hooks! 🚀
