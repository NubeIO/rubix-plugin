# Rubix Plugin UI SDK

Reusable UI components and utilities for building Rubix plugins with consistent styling.

## Features

- ✅ **Design System** - CSS variables matching rubix's theme (light/dark mode)
- ✅ **UI Components** - Button, Card, Input, Label, Badge, Dialog, Skeleton
- ✅ **Plugin Client** - Type-safe API wrapper for node operations
- ✅ **TypeScript** - Full type definitions included
- ✅ **Zero Config** - Just import and use

## Installation

In your plugin's `vite.config.ts`, add an alias:

```typescript
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      '@rubix/plugin-ui': path.resolve(__dirname, '../frontend-sdk'),
    },
  },
});
```

## Quick Start

```tsx
import { Button, Card, CardHeader, CardTitle, CardContent } from '@rubix/plugin-ui';
import { createPluginClient } from '@rubix/plugin-ui';
import type { PluginWidgetProps } from '@rubix/plugin-ui/types';
import '@rubix/plugin-ui/styles.css';

export default function MyWidget(props: PluginWidgetProps) {
  const client = createPluginClient(props);

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Widget</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={() => console.log('Clicked!')}>
          Click me
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Components

### Button

```tsx
<Button variant="default" size="md">Save</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
```

**Variants:** `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`
**Sizes:** `sm`, `md`, `lg`

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
  <CardFooter>Footer actions</CardFooter>
</Card>
```

### Input & Label

```tsx
<div>
  <Label htmlFor="name">Name</Label>
  <Input id="name" type="text" placeholder="Enter name" />
</div>
```

### Badge

```tsx
<Badge variant="default">Active</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="destructive">Error</Badge>
```

### Dialog

```tsx
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>Are you sure?</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Skeleton

```tsx
{loading && <Skeleton className="h-4 w-full" />}
```

## Plugin Client

```tsx
import { createPluginClient } from '@rubix/plugin-ui';

const client = createPluginClient({ orgId, deviceId, baseUrl, token });

// Query nodes
const products = await client.queryNodes({
  filter: 'type is "plm.product"'
});

// Create node
const newProduct = await client.createNode({
  type: 'plm.product',
  name: 'Widget Pro',
  settings: { productCode: 'WGT-001' }
});

// Update node
await client.updateNode(nodeId, { name: 'Updated Name' });

// Delete node
await client.deleteNode(nodeId);
```

See [plugin-client/README.md](./plugin-client/README.md) for full API documentation.

## Design Tokens

The SDK uses CSS variables that automatically adapt to light/dark mode:

```css
--rubix-background
--rubix-foreground
--rubix-primary
--rubix-secondary
--rubix-muted
--rubix-destructive
--rubix-border
--rubix-radius
```

Use these in your custom styles:

```tsx
<div style={{
  background: 'var(--rubix-background)',
  color: 'var(--rubix-foreground)',
  borderRadius: 'var(--rubix-radius)'
}}>
  Custom styled content
</div>
```

## TypeScript Types

```tsx
import type {
  PluginWidgetProps,
  PluginPageProps,
  RubixNode,
  ButtonVariant,
  BadgeVariant,
} from '@rubix/plugin-ui/types';
```

## Examples

See the PLM plugin for a complete example:
`/home/user/code/go/nube/rubix-plugin/nube.plm/`

## License

MIT
