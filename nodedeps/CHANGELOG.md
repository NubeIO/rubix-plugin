# nodedeps Changelog

## [Unreleased] - 2026-03-21

### Added
- **Public API for node constraints** - Moved from `rubix/internal/libs/nodedeps`
- `NodeConstraints` struct - Define lifecycle rules for nodes
- `ChildDependency` struct - Define required child dependencies
- `ConstrainedNode` interface - Nodes implement to declare constraints
- `DefaultConstraints()` - Helper for no restrictions
- `SystemNodeConstraints()` - Helper for core system nodes
- `ServiceNodeConstraints()` - Helper for plugin services/managers
- Complete README with examples and API reference

### Migration
- External plugins can now import and use nodedeps
- Rubix core re-exports from rubix-plugin (backwards compatible)
- See README.md for usage examples

---

_First public release of nodedeps API_
