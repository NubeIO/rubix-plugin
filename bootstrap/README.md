# Bootstrap Library - NATS-Based Hierarchy Management

Reusable library for plugins to bootstrap node hierarchies via NATS.

## Usage

### 1. Create Client

```go
import (
    "github.com/NubeIO/rubix-plugin/bootstrap"
    "github.com/NubeIO/rubix-plugin/natslib"
    "github.com/NubeIO/rubix-plugin/natssubject"
)

// Connect to NATS
nc, _ := natslib.Connect("nats://localhost:4222")
sb := natssubject.NewBuilder("rubix.v1.local", "org1", "device0", "main")

client := &bootstrap.Client{
    NC:      nc,
    Subject: sb,
}
```

### 2. Define Hierarchy

```go
spec := bootstrap.HierarchySpec{
    ServiceNode: bootstrap.NodeSpec{
        Type: "plm.service",
        Name: "PLM System",
        Settings: map[string]interface{}{
            "version": "1.0.0",
        },
    },
    Collections: []bootstrap.NodeSpec{
        {Type: "plm.products", Name: "Products"},
        {Type: "plm.production-runs", Name: "Production Runs"},
    },
}
```

### 3. Bootstrap

```go
result, err := bootstrap.EnsureHierarchy(ctx, client, spec)
if err != nil {
    log.Fatal(err)
}

fmt.Println("Service ID:", result.ServiceID)
fmt.Println("Products ID:", result.CollectionIDs["plm.products"])
```

## Features

- ✅ **Idempotent** - Safe to run multiple times (queries first, creates only if missing)
- ✅ **NATS-only** - No HTTP dependencies
- ✅ **Reusable** - Works for ANY plugin (PLM, manufacturing, inventory, etc.)
- ✅ **Type-safe** - Clear Go structs for specs and results
- ✅ **Retry logic** - Waits for rubix core with exponential backoff
- ✅ **Health checks** - Pings server to ensure it's ready before creating nodes

## Example: PLM Plugin

See `nube.plm/internal/bootstrap/plm_hierarchy.go` for a complete example of using this library to bootstrap the PLM hierarchy.

## API Reference

### Client

Wraps NATS client and subject builder for node operations.

```go
type Client struct {
    NC      *natslib.Client
    Subject *natssubject.Builder
}
```

### NodeSpec

Defines a node to create.

```go
type NodeSpec struct {
    Type        string                 // Node type (e.g., "plm.service")
    Name        string                 // Display name
    Description string                 // Optional description (merged into settings)
    Settings    map[string]interface{} // Custom settings
}
```

### HierarchySpec

Defines a complete hierarchy (service + collections).

```go
type HierarchySpec struct {
    ServiceNode NodeSpec   // Root service node
    Collections []NodeSpec // Collection nodes under service
}
```

### EnsureNode

Gets existing node or creates it (idempotent).

```go
func EnsureNode(ctx context.Context, client *Client, spec NodeSpec, parentID string) (string, error)
```

### EnsureHierarchy

Creates service root + collection nodes (idempotent).

```go
func EnsureHierarchy(ctx context.Context, client *Client, spec HierarchySpec) (*HierarchyResult, error)
```

Returns:
```go
type HierarchyResult struct {
    ServiceID     string            // ID of service root node
    CollectionIDs map[string]string // Map: collection type → node ID
}
```

## NATS Subjects Used

- **Query**: `{prefix}.{orgId}.{deviceId}.{flowId}.query`
- **Create**: `{prefix}.{orgId}.{deviceId}.{flowId}.nodes.create`

## Error Handling

All functions return descriptive errors:

```go
result, err := bootstrap.EnsureHierarchy(ctx, client, spec)
if err != nil {
    // err includes context: "ensure service root: query existing node: <NATS error>"
    log.Fatal(err)
}
```
