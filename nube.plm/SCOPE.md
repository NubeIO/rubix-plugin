# PLM Plugin - Scope

**Goal:** Product Lifecycle Management system built on Rubix nodes

**Current Phase:** Phase 1 - Product CRUD

---

## Phases

### Phase 1: Product CRUD ⭐ CURRENT
**Goal:** Basic create, read, update, delete for products

**Node Types:**
- `plm.product` - Products with settings (productCode, description, status, price)

**Deliverable:**
- Products can be created, read, updated, deleted, and queried via standard Rubix API

**Timeline:** 1-2 days

---

### Phase 2: BOM (Bill of Materials) ⏸️ FUTURE
**Goal:** Add part relationships and BOM explosion

**Node Types:**
- `plm.part` - Parts/components
- Add `bomItem` refs to products

**Features:**
- Link products to parts via refs
- Calculate multi-level BOMs
- Cost rollup from parts

**Timeline:** 3-5 days

---

### Phase 3: Manufacturing ⏸️ FUTURE
**Goal:** Track production runs

**Node Types:**
- `plm.manufacturing_run` - Production runs
- `plm.serialized_unit` - Individual units with serial numbers

**Timeline:** 5-7 days

---

### Phase 4: Quality & RMA ⏸️ FUTURE
**Goal:** Test records and RMA tracking

**Node Types:**
- `plm.test_record` - QA test results
- `plm.task` - RMA tasks

**Timeline:** 3-5 days

---

## Architecture

**Everything is a node** - No custom database tables

Products, parts, units, etc. are all stored as Rubix nodes:
- Settings (JSONB) for flexible schemas
- Refs for relationships (BOM, supplier, etc.)
- Identity tags for fast queries
- Standard node API for all CRUD

---

## Current Focus: Phase 1

**Files:**
- `plugin.json` - Defines `plm.product` node type
- `internal/product/product.go` - Product struct and service (prepared for future)
- `main.go` - Plugin entry point (just connects to NATS)
- `test-product-crud.sh` - CRUD test script

**Success Criteria:**
- [x] Plugin builds
- [ ] Plugin loads in Rubix
- [ ] Create product via API
- [ ] Read product via API
- [ ] Update product settings
- [ ] Query products
- [ ] Delete product

**When all checked, Phase 1 is complete!**

---

**Last Updated:** 2026-03-20
