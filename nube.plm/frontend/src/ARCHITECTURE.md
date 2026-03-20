# PLM Plugin Frontend Architecture

**Feature-First Organization for Long-Term Maintainability**

---

## 📂 Directory Structure

```
src/
├── products/                      # PRODUCT FEATURE (complete domain)
│   ├── common/                    # Product-specific logic
│   │   ├── types.ts              # Product types & interfaces
│   │   ├── api.ts                # ProductsAPI class
│   │   ├── hooks.ts              # useProducts hook
│   │   └── utils.ts              # Product utilities
│   │
│   ├── components/                # Product UI components
│   │   ├── product-form-fields.tsx
│   │   ├── product-table.tsx
│   │   ├── product-status-badge.tsx
│   │   └── index.ts
│   │
│   ├── dialogs/                   # Product dialogs
│   │   ├── create-product-dialog.tsx
│   │   ├── edit-product-dialog.tsx
│   │   ├── delete-product-dialog.tsx
│   │   └── index.ts
│   │
│   ├── widget/                    # Product widgets
│   │   ├── ProductTableWidget.tsx (140 lines)
│   │   └── index.ts
│   │
│   ├── node/                      # Product node view (future)
│   │   └── ProductNodeView.tsx
│   │
│   ├── page/                      # Product pages (future)
│   │   └── ProductsPage.tsx
│   │
│   └── index.ts                   # Export all product features
│
├── manufacturing/                 # MANUFACTURING FEATURE (future)
│   ├── common/
│   ├── components/
│   ├── dialogs/
│   ├── widget/
│   ├── node/
│   └── page/
│
├── serialized-units/              # SERIALIZED UNITS FEATURE (future)
│   └── ...
│
├── work-items/                    # WORK ITEMS FEATURE (future)
│   └── ...
│
├── deployments/                   # DEPLOYMENTS FEATURE (future)
│   └── ...
│
├── shared/                        # SHARED ACROSS ALL FEATURES
│   ├── components/                # Generic UI components
│   │   ├── icons.tsx
│   │   └── index.ts
│   │
│   ├── hooks/                     # Cross-feature hooks
│   │   ├── use-plm-service.ts    # PLM root initialization
│   │   └── index.ts
│   │
│   └── constants.ts               # Global constants
│
├── widgets/                       # LEGACY EXPORT PATH
│   └── ProductTableWidget.tsx    # Re-exports from products/widget/
│
└── index.ts                       # Main plugin exports
```

---

## 🎯 Design Principles

### 1. **Feature Cohesion**
Everything about a feature lives in one place:
- ✅ `products/` contains ALL product code
- ✅ `manufacturing/` will contain ALL manufacturing code
- ✅ Easy to find, easy to modify

### 2. **Clear Boundaries**
```
products/common/     → Product-specific logic
shared/              → Used by 2+ features
```

### 3. **Parallel Development**
- Person A works on `products/`
- Person B works on `manufacturing/`
- **No merge conflicts!**

### 4. **Easy to Extract**
Each feature could become its own package:
```
@plm/products
@plm/manufacturing
@plm/work-items
```

### 5. **Scales to Full Vision**
From VISION.md:
- ✅ Products → `products/`
- ✅ Manufacturing → `manufacturing/`
- ✅ Serialized Units → `serialized-units/`
- ✅ Work Items → `work-items/`
- ✅ Deployments → `deployments/`

---

## 📦 Feature Structure Template

Every feature follows the same structure:

```
<feature>/
├── common/              # Feature-specific logic (no UI)
│   ├── types.ts        # TypeScript interfaces
│   ├── api.ts          # API methods (FeatureAPI class)
│   ├── hooks.ts        # Custom hooks (useFeature)
│   └── utils.ts        # Utility functions
│
├── components/          # Reusable UI components
│   ├── feature-table.tsx
│   ├── feature-form-fields.tsx
│   └── index.ts
│
├── dialogs/             # Feature dialogs
│   ├── create-dialog.tsx
│   ├── edit-dialog.tsx
│   └── index.ts
│
├── widget/              # Dashboard widgets
│   ├── FeatureTableWidget.tsx
│   └── index.ts
│
├── node/                # Node view (full page in node editor)
│   └── FeatureNodeView.tsx
│
├── page/                # Standalone pages
│   └── FeaturePage.tsx
│
└── index.ts             # Export everything
```

---

## 🔄 Refactoring Results

### Before: Type-First (962 lines in 1 file)
```
src/
├── types/               # All types together
├── lib/                 # All logic together
├── components/          # All components together
└── widgets/
    └── ProductTableWidget.tsx (962 lines)
```

**Problems:**
- 🔴 Hard to find product-specific code
- 🔴 Types scattered across `types/product.ts`, `types/forms.ts`, `types/widget.ts`
- 🔴 Doesn't scale to manufacturing, work items, etc.
- 🔴 Merge conflicts when multiple people work

---

### After: Feature-First (140 lines orchestrator)
```
src/
├── products/            # Everything product-related
│   ├── common/         # Logic
│   ├── components/     # UI
│   ├── dialogs/        # Dialogs
│   └── widget/         # Widget (140 lines)
└── shared/              # Truly shared code
```

**Benefits:**
- ✅ Everything product-related in `products/`
- ✅ Widget is a thin orchestrator (140 lines)
- ✅ Easy to add manufacturing, work items, etc.
- ✅ Parallel development without conflicts

---

## 🚀 Adding New Features

### Step 1: Create Feature Directory
```bash
mkdir -p src/manufacturing/{common,components,dialogs,widget,node,page}
```

### Step 2: Create Common Layer
```typescript
// src/manufacturing/common/types.ts
export interface ProductionRun { ... }

// src/manufacturing/common/api.ts
export class ManufacturingAPI { ... }

// src/manufacturing/common/hooks.ts
export function useProductionRuns() { ... }
```

### Step 3: Create Components
```typescript
// src/manufacturing/components/production-run-table.tsx
export function ProductionRunTable() { ... }
```

### Step 4: Create Widget
```typescript
// src/manufacturing/widget/ProductionRunWidget.tsx
export default function ProductionRunWidget() {
  const { runs } = useProductionRuns();
  return <ProductionRunTable runs={runs} />;
}
```

### Step 5: Export
```typescript
// src/manufacturing/index.ts
export * from './common';
export * from './components';
export * from './widget';
```

---

## 📚 Import Patterns

### ✅ Good: Import from feature root
```typescript
import { Product, useProducts, ProductTable } from '../products';
```

### ✅ Good: Import from shared
```typescript
import { PlusIcon, usePLMService } from '../shared';
```

### ❌ Bad: Deep imports
```typescript
import { Product } from '../products/common/types';
import { useProducts } from '../products/common/hooks';
// Instead, use: import { Product, useProducts } from '../products';
```

---

## 🔧 Maintenance Guidelines

### Adding Product Functionality
**Where:** `products/`
- New component → `products/components/`
- New dialog → `products/dialogs/`
- New utility → `products/common/utils.ts`
- New widget → `products/widget/`

### Adding Cross-Feature Code
**Where:** `shared/`
- Generic component → `shared/components/`
- Cross-feature hook → `shared/hooks/`
- Global constant → `shared/constants.ts`

### Rule of Thumb
**Ask:** Is this used by 2+ features?
- **Yes** → Put in `shared/`
- **No** → Put in `<feature>/`

---

## 📊 Metrics

### Code Organization
- **Before:** 962 lines in 1 file
- **After:** 140 line orchestrator + modular components

### Files Created
- Types: 1 file (36 lines)
- API: 1 file (95 lines)
- Hooks: 1 file (78 lines)
- Utils: 1 file (27 lines)
- Components: 3 files (240 lines total)
- Dialogs: 3 files (220 lines total)
- Widget: 1 file (140 lines)
- **Total:** 13 files, clean separation

---

## 🎓 Learning Resources

### Feature-First Architecture
- **Why?** Scales better than type-first
- **When?** Always for multi-feature apps
- **Reference:** See `products/` as example

### Code Reuse
- **Feature-specific:** `<feature>/components/`
- **Cross-feature:** `shared/components/`

### Parallel Development
- Work on `products/` independently
- Work on `manufacturing/` independently
- No merge conflicts between features

---

## ✅ Success Criteria

- [x] Everything product-related in `products/`
- [x] Shared code in `shared/`
- [x] Widget is thin orchestrator (~140 lines)
- [x] Clear feature boundaries
- [x] Easy to add new features (manufacturing, work items, etc.)
- [x] Documentation complete

---

_Last Updated: 2026-03-20_
_Architecture: Feature-First Organization_
