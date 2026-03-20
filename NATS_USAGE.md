# NATS Usage Guide for Plugins

This guide shows how plugins should communicate with Rubix core via NATS using the shared libraries.

## Libraries

Plugins should use these shared libraries from `rubix-plugin`:

1. **`natslib`** - NATS client wrapper
2. **`natssubject`** - Subject builder (creates consistent NATS subjects)

## Quick Start

### 1. Basic NATS Client

```go
import (
    "github.com/NubeDev/rubix-plugin/natslib"
    "github.com/NubeDev/rubix-plugin/natssubject"
)

// Connect to NATS
nc, err := natslib.Connect("nats://localhost:4222")
if err != nil {
    log.Fatal(err)
}
defer nc.Close()

// Create subject builder
sb := natssubject.NewBuilder("rubix.v1.local", "default", "default", "main")

// Get a node
subject := sb.Build("nodes", "get")
reqData, _ := json.Marshal(map[string]interface{}{"nodeId": "node_123"})
respData, err := nc.Request(subject, reqData, 5*time.Second)
```

### 2. Convenience Helper (Recommended)

```go
import "github.com/NubeDev/rubix-plugin/natslib"

// Create plugin client (combines NATS + subject builder)
pc, err := natslib.NewPluginClient(
    "nats://localhost:4222",
    "rubix.v1.local",
    "default",
    "default",
    "main",
)
if err != nil {
    log.Fatal(err)
}
defer pc.Close()

// Use it
subject := pc.Subject.Build("nodes", "get")
respData, err := pc.Request(subject, reqData, 5*time.Second)
```

## Common Operations

### Get a Node

```go
subject := pc.Subject.Build("nodes", "get")
reqData, _ := json.Marshal(map[string]interface{}{"nodeId": nodeID})
respData, err := pc.Request(subject, reqData, 5*time.Second)

var node Node
json.Unmarshal(respData, &node)
```

### Query Nodes

```go
subject := pc.Subject.Build("query")
reqData, _ := json.Marshal(map[string]interface{}{
    "query": "type is 'plm.product'",
})
respData, err := pc.Request(subject, reqData, 5*time.Second)

var result struct {
    Data []Node `json:"data"`
}
json.Unmarshal(respData, &result)
```

### Query Refs

```go
subject := pc.Subject.Build("query")
reqData, _ := json.Marshal(map[string]interface{}{
    "query": "fromNodeId is 'node_123'",
    "table": "refs",
})
respData, err := pc.Request(subject, reqData, 5*time.Second)

var result struct {
    Data []Ref `json:"data"`
}
json.Unmarshal(respData, &result)
```

### Update Node Settings

```go
subject := pc.Subject.Build("nodes", "update")
reqData, _ := json.Marshal(map[string]interface{}{
    "nodeId": nodeID,
    "node": map[string]interface{}{
        "settings": map[string]interface{}{
            "status": "Production",
            "unitCost": 123.45,
        },
    },
})
respData, err := pc.Request(subject, reqData, 5*time.Second)
```

## Subject Patterns

The subject builder creates subjects in this format:
```
{prefix}.{orgId}.{deviceId}.{flowId}.{resource}.{action}
```

### Examples:

| Operation | Subject |
|-----------|---------|
| Get node | `rubix.v1.local.default.default.main.nodes.get` |
| Update node | `rubix.v1.local.default.default.main.nodes.update` |
| Query | `rubix.v1.local.default.default.main.query` |
| History | `rubix.v1.local.default.default.main.history` |

### Building Custom Subjects

```go
// Simple: resource + action
subject := sb.Build("nodes", "list")

// Complex: multiple parts
subject := sb.Build("pubsub", "portvalue", "sensor-1", "out")
```

## Hook Context

When your plugin receives a hook event, extract org/device/flow IDs from the NATS subject:

```go
func handleHook(msg *nats.Msg) {
    // Parse subject to get org/device/flow
    // Subject: rubix.v1.local.{orgId}.{deviceId}.{flowId}.hooks.after_ref_create.node.plm.product

    components, err := natssubject.ParseFull(msg.Subject)
    if err != nil {
        log.Printf("ERROR: Failed to parse subject: %v", err)
        return
    }

    // Create subject builder for this org/device/flow
    sb := natssubject.NewBuilder(
        components.Prefix,
        components.OrgID,
        components.DeviceID,
        components.FlowID,
    )

    // Now you can make requests
    subject := sb.Build("nodes", "get")
    // ...
}
```

## Best Practices

1. ✅ **Use subject builder** - Don't manually construct subjects with `fmt.Sprintf`
2. ✅ **Reuse client** - Create one NATS client per plugin, reuse across hook handlers
3. ✅ **Parse hook subjects** - Extract org/device/flow from incoming hook subjects
4. ✅ **Handle timeouts** - Use reasonable timeouts (5s for simple queries, longer for complex)
5. ✅ **Error handling** - Check errors on NATS requests, log failures

## Anti-Patterns

❌ **Don't do this:**
```go
// Hardcoded subjects
subject := "rubix.v1.local.default.default.main.nodes.get"

// Manual sprintf
subject := fmt.Sprintf("rubix.v1.local.%s.%s.%s.nodes.get", orgID, deviceID, flowID)
```

✅ **Do this instead:**
```go
// Use subject builder
subject := sb.Build("nodes", "get")
```

## Example: BOM Explosion

See `nube.plm/internal/bom/explosion.go` for a complete example of using the subject builder in a plugin.

```go
func ExplodeBOM(nc *natslib.Client, sb *natssubject.Builder, productID string) ([]BOMItem, error) {
    // Get node
    subject := sb.Build("nodes", "get")
    reqData, _ := json.Marshal(map[string]interface{}{"nodeId": productID})
    respData, err := nc.Request(subject, reqData, 5*time.Second)
    // ...

    // Query refs
    querySubject := sb.Build("query")
    query := fmt.Sprintf("fromNodeId is '%s'", productID)
    queryReq, _ := json.Marshal(map[string]interface{}{"query": query, "table": "refs"})
    queryResp, err := nc.Request(querySubject, queryReq, 5*time.Second)
    // ...
}
```

---
**Summary:** Use `natslib` + `natssubject` for all plugin-to-core communication. No HTTP! 🚀
