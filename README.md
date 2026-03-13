# rubix-plugin

## Demo CLI: Fake Plugin Generator

Interactive Bubble Tea + Lip Gloss demo tool for generating a fake plugin scaffold.

Run it from the repo root:

```bash
go run ./cmd/fake-plugin-generator
```

It creates a demo plugin in `./generated-plugins/<your-slug>` with:
- `plugin.json`
- `go.mod`
- `cmd/main.go`
- `internal/node/node.go`
- `frontend/src/main.tsx`
- `README.md`
