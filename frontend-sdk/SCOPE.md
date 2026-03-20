# Rubix Plugin UI SDK - Long-Term Scope

**Vision:** ONE common design system used by BOTH the main Rubix frontend AND all plugins.

## Architecture Goals

### Unified Design System
```
┌─────────────────────────────────────────┐
│   Rubix Plugin UI SDK (Design System)   │
│                                         │
│  - Tailwind v4 Configuration            │
│  - shadcn/ui Style Components           │
│  - Design Tokens                        │
│  - Plugin Client (API Wrapper)          │
└─────────────────────────────────────────┘
           ▲                    ▲
           │                    │
    ┌──────┴──────┐      ┌─────┴──────┐
    │ Main Rubix  │      │  Plugins   │
    │  Frontend   │      │ (PLM, etc) │
    └─────────────┘      └────────────┘
```

**Benefits:**
- ✅ Consistent UI across main app and plugins
- ✅ Single source of truth for design
- ✅ Main app and plugins share components
- ✅ Updates to SDK improve everything
- ✅ Developers learn once, use everywhere

---

## Current State (March 2026)

**Main Rubix Frontend:**
- Uses Tailwind v4
- Uses shadcn/ui components (in `frontend/src/components/ui/`)
- Has design tokens in `globals.css`
- NOT using shared SDK yet

**Plugins:**
- Isolated, separate frontends
- No shared component library (until now)
- Inconsistent styling

**Problem:** Duplication, inconsistency, maintenance burden

---

## Long-Term Plan

### Phase 1: SDK Foundation (✅ DONE)
**Status:** Complete
**What we built:**
- Package structure
- Design tokens CSS
- Basic components (Button, Card, Input, Label, Badge, Dialog, Skeleton)
- Plugin client wrapper
- TypeScript types

**Current Issue:** Components use CSS variables (`bg-[var(--rubix-*)]`) instead of Tailwind utilities, and plugins don't have Tailwind configured → inconsistent styling with main app

---

### Phase 2: Proper Tailwind Integration (NEXT - DO THIS NOW)

**Goal:** Make SDK components look good using Tailwind v4

**2.1. Add Tailwind to SDK**
```bash
cd /home/user/code/go/nube/rubix-plugin/frontend-sdk
npm init -y
npm install -D tailwindcss@next @tailwindcss/vite
npm install react react-dom  # peer deps
```

**2.2. Create Tailwind v4 Config (using @theme syntax)**
```css
/* frontend-sdk/globals.css */
@import 'tailwindcss';

/* Design tokens - match main rubix app exactly */
:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... copy from main app's globals.css */
}

.dark {
  --background: oklch(0.145 0 0);
  /* ... dark mode tokens */
}

@theme inline {
  --radius-lg: var(--radius);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... expose as Tailwind utilities */
}
```

**2.3. Build SDK as NPM Package**
```json
// frontend-sdk/package.json
{
  "name": "@rubix/plugin-ui",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./globals.css": "./dist/globals.css"
  },
  "scripts": {
    "build": "tsup && tailwindcss -i ./globals.css -o dist/globals.css",
    "dev": "tsup --watch"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0-alpha.25",
    "tsup": "^8.0.0"
  }
}
```

**2.4. Plugins Install SDK**
```bash
cd nube.plm/frontend
npm install file:../../frontend-sdk
# Or: npm install @rubix/plugin-ui (if published)
```

**2.5. Plugins Import SDK Styles (Tailwind v4)**
```ts
// nube.plm/frontend/src/main.tsx
import '@rubix/sdk/globals.css';  // ← Imports Tailwind + design tokens
import './index.css';  // ← Plugin-specific styles (if any)
```

```ts
// nube.plm/frontend/vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),  // ← Enable Tailwind v4
    federation({ /* ... */ }),
  ],
});
```

**Outcome:** Plugins get beautiful, consistent UI with Tailwind

---

### Phase 3: Migrate Main Rubix Frontend to SDK (FUTURE)

**Goal:** Main rubix app uses SDK instead of local components

**3.1. Audit Current Components**
```bash
# What's in rubix/frontend/src/components/ui/?
# What can we move to SDK?
```

**3.2. Move Generic Components to SDK**
- Button, Card, Input, Label → Already in SDK
- Dialog, Sheet, Popover → Add to SDK
- Table, Select, Checkbox → Add to SDK
- Custom components (NodeCard, etc) → Stay in main app

**3.3. Main App Imports from SDK**
```tsx
// Before
import { Button } from '@/components/ui/button';

// After
import { Button } from '@rubix/plugin-ui';
```

**3.4. Deprecate Local Components**
- Keep `components/ui/` for backward compatibility
- New features use SDK
- Gradually migrate old code

**Outcome:** Single source of truth for UI components

---

### Phase 4: Advanced SDK Features (FUTURE)

**4.1. More Components**
- Table with sorting, filtering, pagination
- Charts (using recharts or similar)
- Date pickers, time pickers
- Advanced forms with validation
- Toast notifications (sonner)
- Command palette
- Dropdown menus, context menus

**4.2. Hooks & Utilities**
```tsx
// Shared hooks
import { usePluginClient, useRubixQuery, useRubixMutation } from '@rubix/plugin-ui/hooks';

// Utilities
import { cn, formatDate, formatNumber } from '@rubix/plugin-ui/utils';
```

**4.3. Theming API**
```tsx
// Allow plugins to customize theme
import { ThemeProvider } from '@rubix/plugin-ui';

<ThemeProvider theme={{ primaryColor: 'blue' }}>
  <MyPlugin />
</ThemeProvider>
```

**4.4. Documentation Site**
- Storybook or similar
- Live component demos
- Copy-paste examples
- Design guidelines

**4.5. CLI Tool**
```bash
# Scaffold new plugin with SDK pre-configured
npx @rubix/create-plugin my-plugin

# Add components to plugin
npx @rubix/plugin-ui add table
```

---

## Technical Decisions

### Why Tailwind v4?
- ✅ Rubix main app already uses it
- ✅ Simpler than v3 (`@import` syntax, no config file needed)
- ✅ Better performance
- ✅ Industry standard
- ✅ Great DX with autocomplete

### Why shadcn/ui Style?
- ✅ Copy-paste components (own your code)
- ✅ Accessible by default
- ✅ Customizable
- ✅ Not a dependency (just source code)
- ✅ Proven pattern

### Why NOT a Component Library (MUI, Ant Design)?
- ❌ Heavy dependencies
- ❌ Hard to customize
- ❌ Different design language than rubix
- ❌ Bundle size

### Package Distribution
**Option A: NPM Package** (Recommended)
```bash
npm publish @rubix/plugin-ui
```
- ✅ Standard distribution
- ✅ Versioning
- ✅ Easy to update
- ❌ Requires npm account

**Option B: File Reference** (Current)
```json
"@rubix/plugin-ui": "file:../../frontend-sdk"
```
- ✅ Easy for development
- ✅ No publishing needed
- ❌ Not portable
- ❌ Harder to version

**Recommendation:** Use file reference for now, publish to npm when stable

---

## Implementation Checklist

### Immediate (Phase 2)
- [ ] Add Tailwind v4 to frontend-sdk
- [ ] Set up build process (tsup + tailwindcss)
- [ ] Rewrite components with proper Tailwind classes
- [ ] Add Tailwind config to PLM plugin
- [ ] Test build and verify styling works
- [ ] Document setup for plugin developers

### Short-term (Phase 3)
- [ ] Audit main rubix components
- [ ] Create migration plan
- [ ] Add SDK to main rubix frontend
- [ ] Migrate one feature to SDK (proof of concept)
- [ ] Document migration guide

### Long-term (Phase 4)
- [ ] Add advanced components (Table, Charts, etc)
- [ ] Create hooks library
- [ ] Build documentation site
- [ ] Create CLI tool
- [ ] Publish to npm

---

## Success Metrics

**Phase 2:**
- ✅ PLM plugin looks identical to rubix main app
- ✅ Other plugins can use SDK with <5 min setup
- ✅ SDK bundle size < 100KB

**Phase 3:**
- ✅ Main rubix app uses SDK for 50%+ of components
- ✅ No duplicate Button/Card/Input components
- ✅ Design changes propagate to all apps

**Phase 4:**
- ✅ All rubix features use SDK
- ✅ 5+ plugins using SDK
- ✅ Community contributions
- ✅ Documentation site live

---

## Migration Path

### For Existing Plugins
```bash
# 1. Install SDK
npm install @rubix/plugin-ui

# 2. Add Tailwind config
echo "import baseConfig from '@rubix/plugin-ui/tailwind.config';\nexport default baseConfig;" > tailwind.config.js

# 3. Import styles
// src/index.tsx
import '@rubix/plugin-ui/styles.css';

# 4. Replace components
- import { createPluginClient } from '@rubix/sdk/plugin-client';
+ import { createPluginClient, Button, Card } from '@rubix/plugin-ui';
```

### For Main Rubix Frontend
```bash
# 1. Install SDK
cd rubix/frontend
npm install file:../../rubix-plugin/frontend-sdk

# 2. Import from SDK
- import { Button } from '@/components/ui/button';
+ import { Button } from '@rubix/plugin-ui';

# 3. Gradually migrate files
# Keep old components for compatibility
# New features use SDK
```

---

## Questions to Answer

1. **Should we publish to npm or keep file-based?**
   - Recommendation: Start file-based, publish when stable

2. **Should main rubix app use SDK or SDK use main app components?**
   - Recommendation: SDK is source of truth, main app imports from SDK

3. **How to handle breaking changes?**
   - Semantic versioning
   - Deprecation warnings
   - Migration guides

4. **Who maintains the SDK?**
   - Core rubix team
   - Community contributions welcome
   - Clear contribution guidelines

5. **What about plugin-specific components?**
   - Generic → SDK
   - Plugin-specific → Keep in plugin
   - Example: Button → SDK, ProductTable → PLM plugin

---

## Next Steps (RIGHT NOW)

1. **Add Tailwind to SDK** - Set up proper build
2. **Rewrite components** - Use Tailwind utilities
3. **Update PLM plugin** - Configure Tailwind, test styling
4. **Document** - README with setup instructions
5. **Test** - Build, verify it looks good

**Goal:** PLM plugin looks professional and polished, ready to ship.

---

**Status:** 📝 Phase 1 complete, starting Phase 2
**Owner:** Engineering team
**Timeline:** Phase 2 (1-2 days), Phase 3 (1 week), Phase 4 (ongoing)
