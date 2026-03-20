# PLM Plugin

Product Lifecycle Management system built on Rubix.

**Current Status:** Phase 1 - Product CRUD only

---

## Quick Start

### 1. Build Plugin
```bash
cd /home/user/code/go/nube/rubix-plugin/nube.plm
make build
```

### 2. Install in Rubix
```bash
# From rubix directory
cd /home/user/code/go/nube/rubix
mkdir -p bin/orgs/default/plugins/nube.plm/
cp /home/user/code/go/nube/rubix-plugin/nube.plm/nube.plm \
   bin/orgs/default/plugins/nube.plm/
cp /home/user/code/go/nube/rubix-plugin/nube.plm/plugin.json \
   bin/orgs/default/plugins/nube.plm/
```

### 3. Restart Rubix
```bash
# Restart to load plugin
go run cmd/server/main.go
```

### 4. Test Product CRUD
```bash
cd /home/user/code/go/nube/rubix-plugin/nube.plm
./test-product-crud.sh
```

---

## What's Implemented

### Phase 1: Product CRUD ✅ IN PROGRESS

**Node Type:** `plm.product`

**Product Settings:**
```json
{
  "productCode": "WP-001",
  "description": "Widget Pro",
  "status": "Design",
  "price": 250.00
}
```

**Status Options:** Design, Prototype, Production, Discontinued

**API Examples:**

Create:
```bash
curl -X POST http://localhost:1660/api/v1/default/default/nodes \
  -H "Content-Type: application/json" \
  -d '{
    "type": "plm.product",
    "name": "Widget Pro",
    "settings": {
      "productCode": "WP-001",
      "status": "Design",
      "price": 250
    }
  }'
```

Query:
```bash
curl -X POST http://localhost:1660/api/v1/default/default/query \
  -H "Content-Type: application/json" \
  -d '{"query": "type is \"plm.product\""}'
```

---

## What's Coming

### Phase 2: BOM (Future)
- Parts and BOM relationships
- Cost calculation from BOM
- Multi-level BOMs

### Phase 3: Manufacturing (Future)
- Production runs
- Serial number tracking
- Material consumption

### Phase 4: Quality & RMA (Future)
- Test records
- RMA tracking
- Warranty management

---

## Structure

```
nube.plm/
├── plugin.json              # Node type definitions
├── main.go                  # Plugin entry point
├── internal/
│   └── product/
│       └── product.go       # Product service (prepared for future)
├── future/
│   └── bom/
│       └── explosion.go     # BOM logic (Phase 2)
├── test-product-crud.sh     # Test script
├── SCOPE.md                 # Detailed scope
└── README.md                # This file
```

---

## Documentation

- [SCOPE.md](SCOPE.md) - Full project scope and phases
- [plugin.json](plugin.json) - Node type definitions
- [internal/product/product.go](internal/product/product.go) - Product service

---

**Focus:** Get Phase 1 working, then iterate.
