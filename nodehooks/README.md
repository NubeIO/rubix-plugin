# Node Hooks - Common Plugin Library

Common library for plugins to control CRUD operations on their node types.

## Overview

This package provides a standard interface for plugins to:
- **Validate** node creation/update/deletion
- **Transform** nodes before they're saved
- **Block** operations that violate plugin business rules
- **React** to successful operations (logging, notifications, etc.)

## Installation

This package is part of the `rubix-plugin` module. All plugins automatically have access to it:

```go
import "github.com/NubeIO/rubix-plugin/nodehooks"
```

## Quick Start

### 1. Implement the NodeHooks interface

```go
// internal/hooks/node_hooks.go
package hooks

import (
    "context"
    "github.com/NubeIO/rubix-plugin/nodehooks"
)

type PLMHooks struct {
    nodehooks.NoOpHooks // Embed to get default implementations
    db Database
}

// Override only the hooks you need
func (h *PLMHooks) BeforeCreate(ctx context.Context, req *nodehooks.BeforeCreateRequest) (*nodehooks.BeforeCreateResponse, error) {
    // Example: Validate product code is unique
    if req.Node.Type == "plm.product" {
        productCode, ok := req.Node.Settings["productCode"].(string)
        if !ok || productCode == "" {
            return &nodehooks.BeforeCreateResponse{
                Allow:  false,
                Reason: "productCode is required for plm.product nodes",
            }, nil
        }

        exists, err := h.db.ProductCodeExists(ctx, productCode)
        if err != nil {
            return nil, err // Return error = block with error message
        }

        if exists {
            return &nodehooks.BeforeCreateResponse{
                Allow:  false,
                Reason: "product code '" + productCode + "' already exists",
            }, nil
        }
    }

    return &nodehooks.BeforeCreateResponse{Allow: true}, nil
}

func (h *PLMHooks) AfterCreate(ctx context.Context, req *nodehooks.AfterCreateRequest) (*nodehooks.AfterCreateResponse, error) {
    // Example: Log creation, send notification, update cache, etc.
    log.Info().Str("nodeId", req.Node.ID).Str("type", req.Node.Type).Msg("Node created")
    return &nodehooks.AfterCreateResponse{}, nil
}
```

### 2. Register NATS subscriptions

```go
// main.go
package main

import (
    "github.com/NubeIO/rubix-plugin/nodehooks"
    "github.com/NubeIO/rubix-plugin/natslib"
    "github.com/NubeIO/rubix-plugin/pluginnode"
    "your-plugin/internal/hooks"
)

func main() {
    // Connect to NATS
    nc, err := natslib.Connect(natsURL)
    if err != nil {
        log.Fatal().Err(err).Msg("failed to connect to NATS")
    }
    defer nc.Close()

    // Create hook handler
    plmHooks := hooks.NewPLMNodeHooks()

    // Create subject builder for this plugin
    hookSubjects := nodehooks.NewSubjectBuilder(
        prefix,      // "rubix.v1.local"
        orgID,       // "test"
        deviceID,    // "device0"
        vendor,      // "nube"
        pluginName,  // "plm"
    )

    // Create NATS handler and register all hooks
    hookHandler := nodehooks.NewNATSHandler(plmHooks, nc, hookSubjects)
    if err := hookHandler.RegisterAll(); err != nil {
        log.Fatal().Err(err).Msg("failed to register hooks")
    }
    defer hookHandler.Unsubscribe()

    // ... rest of plugin logic ...
}
```

### 3. Configure plugin.json

```json
{
  "id": "nube.plm",
  "vendor": "nubeio",
  "name": "plm",
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
  }
}
```

## Hook Types

### Before Hooks (Validation/Blocking)

**BeforeCreate**, **BeforeUpdate**, **BeforeDelete**

These hooks can:
- ✅ Allow the operation
- ⛔ Block the operation (with reason)
- ✏️ Modify the node before saving
- ⚠️ Add warnings

**Example: Block creation**
```go
return &nodehooks.BeforeCreateResponse{
    Allow:  false,
    Reason: "Duplicate product code",
}, nil
```

**Example: Transform node**
```go
modifiedNode := req.Node
modifiedNode.Settings["price"] = 0.0 // Default price

return &nodehooks.BeforeCreateResponse{
    Allow:    true,
    Modified: &modifiedNode,
}, nil
```

**Example: Add warning**
```go
return &nodehooks.BeforeCreateResponse{
    Allow:    true,
    Warnings: []string{"Product price not set, defaulting to $0.00"},
}, nil
```

### After Hooks (Reactions)

**AfterCreate**, **AfterUpdate**, **AfterDelete**

These hooks are **best-effort** - they run after the operation succeeds, and errors are logged but don't affect the operation.

Use for:
- 📝 Logging
- 📧 Notifications
- 🔄 Cache updates
- 📊 Analytics

```go
func (h *PLMHooks) AfterCreate(ctx context.Context, req *nodehooks.AfterCreateRequest) (*nodehooks.AfterCreateResponse, error) {
    // Send notification
    h.notifier.NotifyProductCreated(req.Node)

    // Update search index
    h.search.IndexNode(req.Node)

    return &nodehooks.AfterCreateResponse{}, nil
}
```

## Using NoOpHooks

For plugins that only need to implement a few hooks, embed `nodehooks.NoOpHooks` to get default implementations:

```go
type MyHooks struct {
    nodehooks.NoOpHooks // All hooks return "allow" by default
}

// Override only what you need
func (h *MyHooks) BeforeCreate(ctx context.Context, req *nodehooks.BeforeCreateRequest) (*nodehooks.BeforeCreateResponse, error) {
    // Your custom logic
}

// Other hooks automatically return "allow"
```

## Error Handling

### Return error to block with error message
```go
return nil, fmt.Errorf("database connection failed")
// Result: HTTP 500, operation blocked
```

### Return Allow=false to block with custom reason
```go
return &nodehooks.BeforeCreateResponse{
    Allow:  false,
    Reason: "Product code must start with 'PRD-'",
}, nil
// Result: HTTP 200, but operation blocked with user-friendly message
```

### Best practice
- Use `error` for unexpected failures (DB errors, network errors)
- Use `Allow=false` for business rule violations (validation failures)

## Flow Diagram

```
User creates node
    ↓
[Rubix] Validate schema
    ↓
[Rubix] Call plugin BeforeCreate hook
    ↓
[Plugin] Validate business rules
    ├─ Allow: true → Continue
    ├─ Allow: false → Block with reason
    └─ Error → Block with error
    ↓
[Rubix] Save to database
    ↓
[Rubix] Call plugin AfterCreate hook (best-effort)
    ↓
[Plugin] Log/notify/update cache
    ↓
[Rubix] Return success to user
```

## Testing

```go
func TestBeforeCreate(t *testing.T) {
    hooks := &PLMHooks{db: mockDB}

    req := &nodehooks.BeforeCreateRequest{
        Node: nodehooks.Node{
            Type: "plm.product",
            Settings: map[string]any{
                "productCode": "PRD-001",
            },
        },
    }

    resp, err := hooks.BeforeCreate(context.Background(), req)

    assert.NoError(t, err)
    assert.True(t, resp.Allow)
}
```

## Common Patterns

### Unique field validation
```go
func (h *Hooks) BeforeCreate(ctx context.Context, req *nodehooks.BeforeCreateRequest) (*nodehooks.BeforeCreateResponse, error) {
    code := req.Node.Settings["code"].(string)
    if h.db.Exists("code", code) {
        return &nodehooks.BeforeCreateResponse{
            Allow:  false,
            Reason: fmt.Sprintf("code '%s' already exists", code),
        }, nil
    }
    return &nodehooks.BeforeCreateResponse{Allow: true}, nil
}
```

### Default values
```go
func (h *Hooks) BeforeCreate(ctx context.Context, req *nodehooks.BeforeCreateRequest) (*nodehooks.BeforeCreateResponse, error) {
    node := req.Node

    if node.Settings["status"] == nil {
        node.Settings["status"] = "draft"
        return &nodehooks.BeforeCreateResponse{
            Allow:    true,
            Modified: &node,
        }, nil
    }

    return &nodehooks.BeforeCreateResponse{Allow: true}, nil
}
```

### Complex validation
```go
func (h *Hooks) BeforeUpdate(ctx context.Context, req *nodehooks.BeforeUpdateRequest) (*nodehooks.BeforeUpdateResponse, error) {
    // Don't allow changing status from "published" to "draft"
    oldStatus := req.OldNode.Settings["status"]
    newStatus := req.NewNode.Settings["status"]

    if oldStatus == "published" && newStatus == "draft" {
        return &nodehooks.BeforeUpdateResponse{
            Allow:  false,
            Reason: "Cannot unpublish a published product",
        }, nil
    }

    return &nodehooks.BeforeUpdateResponse{Allow: true}, nil
}
```

## API Reference

See [interface.go](interface.go) for the full API.
