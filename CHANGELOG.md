# rubix-plugin Changelog

## 2026-03-20 - NATS Subject Builder

### Added
- **`natssubject/builder.go`** - Reusable subject builder for plugins
  - Copied from `rubix/internal/libs/natssubject`
  - Ensures consistent subject format across all plugins
  - Eliminates manual `fmt.Sprintf` for subject construction

- **`natslib/helpers.go`** - Convenience helper for plugins
  - `PluginClient` - combines NATS client + subject builder
  - `NewPluginClient()` - one-line setup for plugin NATS communication

- **`NATS_USAGE.md`** - Complete guide for plugin developers
  - How to use natslib + natssubject
  - Common operations (get node, query, update)
  - Best practices and anti-patterns
  - Hook context extraction example

### Benefits
- ✅ **Consistent subjects** - All plugins use same format
- ✅ **Less boilerplate** - No more `fmt.Sprintf` for subjects
- ✅ **Type safety** - Subject builder prevents typos
- ✅ **Easier maintenance** - Update format in one place

### Example Usage

**Before:**
```go
subject := fmt.Sprintf("rubix.v1.local.%s.%s.%s.nodes.get", orgID, deviceID, flowID)
```

**After:**
```go
sb := natssubject.NewBuilder("rubix.v1.local", orgID, deviceID, flowID)
subject := sb.Build("nodes", "get")
```

**Or with helper:**
```go
pc, _ := natslib.NewPluginClient(natsURL, "rubix.v1.local", orgID, deviceID, flowID)
subject := pc.Subject.Build("nodes", "get")
```

### Migration
Existing plugins (e.g., `nube.plm`) have been updated to use the subject builder.

---

## Previous Versions

### 2026-02-19 - Initial NATS Library
- `natslib/client.go` - Basic NATS wrapper
- `Connect()`, `Request()`, `Publish()`, `SubscribeMsg()`
