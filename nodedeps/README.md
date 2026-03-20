# Node Constraints - Public API

**Package:** `github.com/NubeDev/rubix-plugin/nodedeps`

Public API for defining node lifecycle constraints. Used by both rubix core and external plugins.

---

## Overview

The `nodedeps` package allows node developers to declare constraints that rubix enforces during CRUD operations:

- **Lifecycle rules:** MaxOneNode, DeletionProhibited, cascade delete
- **Parent constraints:** Required parent, allowed parent types
- **Child dependencies:** Required children, auto-creation

---

## Quick Start

### 1. Import the Package

```go
import "github.com/NubeDev/rubix-plugin/nodedeps"
```

### 2. Implement GetConstraints()

```go
func (n *MyNode) GetConstraints() nodedeps.NodeConstraints {
    return nodedeps.NodeConstraints{
        MaxOneNode:         true,
        AllowedParents:     []string{"parent.type"},
        RequiredChildren:   []nodedeps.ChildDependency{},
    }
}
```

### 3. Rubix Enforces Constraints Automatically

When users create/delete nodes, rubix checks constraints and returns validation errors.

---

## API Reference

### NodeConstraints

```go
type NodeConstraints struct {
    MaxOneNode         bool   // Only one node of this type per flow
    DeletionProhibited bool   // Cannot be deleted by user
    AllowCascadeDelete bool   // Delete children when this node deleted
    MustLiveUnderParent bool  // Must have a parent
    HideFromPalette    bool   // Hide from palette API
    AllowedParents     []string            // Allowed parent types (empty = any)
    RequiredChildren   []ChildDependency   // Required children
}
```

### ChildDependency

```go
type ChildDependency struct {
    Type        string  // Child node type
    AutoAdd     bool    // Auto-create if missing
    MinCount    int     // Minimum required (0 = optional)
    MaxCount    int     // Maximum allowed (-1 = unlimited)
    DeleteProof bool    // Child cannot be deleted
}
```

### Helper Functions

#### DefaultConstraints()

Returns default constraints (no restrictions):

```go
func (n *MyNode) GetConstraints() nodedeps.NodeConstraints {
    return nodedeps.DefaultConstraints()
}
```

#### SystemNodeConstraints()

For core system nodes (singleton, cannot delete):

```go
func (n *ServicesNode) GetConstraints() nodedeps.NodeConstraints {
    return nodedeps.SystemNodeConstraints(
        []string{"rubix.device"},  // Must be under device
        []nodedeps.ChildDependency{},
    )
}
```

#### ServiceNodeConstraints()

For plugin services/managers (singleton, deletable):

```go
func (n *PLMServiceNode) GetConstraints() nodedeps.NodeConstraints {
    return nodedeps.ServiceNodeConstraints()
}
```

---

## Common Patterns

### Singleton Node (One Per Org)

```go
func (n *MyServiceNode) GetConstraints() nodedeps.NodeConstraints {
    return nodedeps.NodeConstraints{
        MaxOneNode: true,
        DeletionProhibited: false,
        AllowCascadeDelete: true,
        MustLiveUnderParent: false,
        AllowedParents: []string{},
        RequiredChildren: []nodedeps.ChildDependency{},
    }
}
```

### Node with Required Parent

```go
func (n *ProductNode) GetConstraints() nodedeps.NodeConstraints {
    return nodedeps.NodeConstraints{
        MaxOneNode: false,
        MustLiveUnderParent: true,
        AllowedParents: []string{"plm.service"},
        AllowCascadeDelete: false,
        RequiredChildren: []nodedeps.ChildDependency{},
    }
}
```

### Node with Required Children

```go
func (n *DeviceNode) GetConstraints() nodedeps.NodeConstraints {
    return nodedeps.NodeConstraints{
        MaxOneNode: true,
        DeletionProhibited: true,
        RequiredChildren: []nodedeps.ChildDependency{
            {
                Type: "rubix.services",
                AutoAdd: true,      // Auto-create if missing
                MinCount: 1,        // Exactly 1 required
                MaxCount: 1,
                DeleteProof: true,  // Cannot be deleted
            },
        },
    }
}
```

### Regular User-Created Node

```go
func (n *SensorNode) GetConstraints() nodedeps.NodeConstraints {
    return nodedeps.DefaultConstraints() // No restrictions
}
```

---

## Examples

### PLM Service Node

```go
package nodes

import "github.com/NubeDev/rubix-plugin/nodedeps"

type PLMServiceNode struct {
    // ...
}

func (n *PLMServiceNode) GetConstraints() nodedeps.NodeConstraints {
    return nodedeps.ServiceNodeConstraints()
}
```

### PLM Product Node

```go
func (n *ProductNode) GetConstraints() nodedeps.NodeConstraints {
    return nodedeps.NodeConstraints{
        MaxOneNode:         false,  // Multiple products allowed
        DeletionProhibited: false,  // User can delete
        AllowCascadeDelete: false,  // Products have no children
        MustLiveUnderParent: true,  // Must be under plm.service
        AllowedParents:     []string{"plm.service"},
        RequiredChildren:   []nodedeps.ChildDependency{},
    }
}
```

---

## Validation

When users attempt to create/delete nodes, rubix validates:

1. **MaxOneNode:** Prevents creating second instance
2. **DeletionProhibited:** Prevents deletion
3. **MustLiveUnderParent:** Requires parentId on create
4. **AllowedParents:** Validates parent type
5. **RequiredChildren:** Ensures children exist

Validation errors are returned to the user with clear messages.

---

## Migration from Internal

**Before (internal - plugins couldn't use):**
```go
import "github.com/NubeIO/rubix/internal/libs/nodedeps" // ❌ Blocked by internal/
```

**After (public - plugins can use):**
```go
import "github.com/NubeDev/rubix-plugin/nodedeps" // ✅ Public API
```

---

## See Also

- [rubix-plugin README](../README.md)
- [Plugin Development Guide](../docs/PLUGIN_DEVELOPMENT.md)
- Internal implementation: `rubix/internal/libs/nodedeps/` (rubix core only)

---

_Last Updated: 2026-03-21_
_Package: github.com/NubeDev/rubix-plugin/nodedeps_
