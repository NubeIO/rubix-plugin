# Plugin Client - Reusable API Wrapper for Rubix Plugins

A clean, type-safe wrapper around the RAS (Routing API Specification) client for building plugin widgets.

## Why Use This?

**Before** (manual fetch, duplicated code):
```typescript
const response = await fetch(`${baseUrl}/${orgId}/${deviceId}/query`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  body: JSON.stringify({
    filter: 'type is "plm.product"',
  }),
});

if (!response.ok) throw new Error('Failed');
const result = await response.json();
const products = result.data || [];
```

**After** (clean, reusable):
```typescript
const client = createPluginClient({ orgId, deviceId, baseUrl, token });
const products = await client.queryNodes({
  filter: 'type is "plm.product"',
});
```

## Benefits

- ✅ **Correct URL patterns** - No more `/orgId/deviceId`, uses `/orgs/{orgId}/devices/{deviceId}`
- ✅ **Automatic authentication** - Token injection handled automatically
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Error handling** - Consistent error messages
- ✅ **No duplication** - Reuse across all plugin widgets
- ✅ **Clean code** - Focus on your widget logic, not API boilerplate

## Installation

Add to your plugin's `vite.config.ts`:

```typescript
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@rubix/sdk': path.resolve(__dirname, '../../frontend-sdk'),
    },
  },
});
```

## Usage

### Basic Example

```typescript
import { createPluginClient } from '@rubix/sdk/plugin-client';

function MyWidget({ orgId, deviceId, baseUrl, token }) {
  const client = createPluginClient({ orgId, deviceId, baseUrl, token });

  // Query nodes
  const products = await client.queryNodes({
    filter: 'type is "plm.product"',
  });

  // Create node
  const newProduct = await client.createNode({
    type: 'plm.product',
    name: 'Widget Pro',
    settings: {
      productCode: 'WGT-001',
      price: 99.99,
    },
  });

  // Update node
  await client.updateNode(newProduct.id, {
    settings: { price: 149.99 },
  });

  // Delete node
  await client.deleteNode(newProduct.id);
}
```

### React Hook Pattern

```typescript
import { createPluginClient } from '@rubix/sdk/plugin-client';
import { useState, useEffect, useMemo } from 'react';

function ProductWidget({ orgId, deviceId, baseUrl, token }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create client once (memoized)
  const client = useMemo(
    () => createPluginClient({ orgId, deviceId, baseUrl, token }),
    [orgId, deviceId, baseUrl, token]
  );

  // Fetch products
  useEffect(() => {
    client
      .queryNodes({ filter: 'type is "plm.product"' })
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [client]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}
```

## API Reference

### createPluginClient(config)

Creates a new plugin client instance.

```typescript
const client = createPluginClient({
  orgId: 'test',
  deviceId: 'dev_123',
  baseUrl: '/api/v1',  // optional, defaults to '/api/v1'
  token: 'eyJhbG...',   // optional
});
```

### client.queryNodes(options)

Query nodes using Haystack filter syntax.

```typescript
const products = await client.queryNodes({
  filter: 'type is "plm.product" and status is "Production"',
  limit: 10,
  offset: 0,
  ports: ['out', 'in1'], // optional: include runtime port values
  runtime: true,         // optional: include runtime values
});
```

### client.getNode(nodeId)

Get a single node by ID.

```typescript
const product = await client.getNode('node_abc123');
console.log(product.name, product.settings);
```

### client.createNode(input)

Create a new node.

```typescript
const newProduct = await client.createNode({
  type: 'plm.product',
  name: 'Widget Pro',
  parentId: 'node_parent123', // optional
  settings: {
    productCode: 'WGT-001',
    description: 'Premium widget',
    status: 'Production',
    price: 99.99,
  },
  data: {},      // optional
  ui: {},        // optional
  position: { x: 100, y: 200 }, // optional: for graph nodes
});
```

### client.updateNode(nodeId, input)

Update an existing node.

```typescript
await client.updateNode('node_abc123', {
  name: 'Widget Pro v2',   // optional
  settings: { price: 149.99 },  // optional (partial update)
  data: {},                // optional
  ui: {},                  // optional
  position: { x: 150, y: 250 }, // optional
});
```

### client.deleteNode(nodeId)

Delete a node.

```typescript
await client.deleteNode('node_abc123');
```

### client.listNodes()

List all nodes (use queryNodes for filtering).

```typescript
const allNodes = await client.listNodes();
```

### client.getRASClient()

Get the underlying RAS client for advanced usage (edges, refs, etc.).

```typescript
const rasClient = client.getRASClient();

// Use advanced APIs
await rasClient.edges.create({ ... });
await rasClient.refs.create({ ... });
await rasClient.pages.resolve({ ... });
```

## Error Handling

The plugin client throws `PluginClientError` with helpful information:

```typescript
try {
  await client.createNode({
    type: 'plm.product',
    name: 'Test',
    settings: { price: -10 }, // Invalid!
  });
} catch (err) {
  if (err instanceof PluginClientError) {
    console.error('Status:', err.status);        // HTTP status code
    console.error('Message:', err.message);      // User-friendly message
    console.error('Details:', err.details);      // Raw error details
  }
}
```

## Real-World Example: PLM Product Table Widget

```typescript
import { createPluginClient } from '@rubix/sdk/plugin-client';

export default function ProductTableWidget({ orgId, deviceId, baseUrl, token, settings }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!orgId || !deviceId) return;

    try {
      const client = createPluginClient({ orgId, deviceId, baseUrl, token });
      const products = await client.queryNodes({
        filter: 'type is "plm.product"',
      });
      setProducts(products);
    } catch (err) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (formData) => {
    const client = createPluginClient({ orgId, deviceId, baseUrl, token });
    await client.createNode({
      type: 'plm.product',
      name: formData.name,
      settings: {
        productCode: formData.productCode,
        description: formData.description,
        status: formData.status,
        price: parseFloat(formData.price),
      },
    });
    fetchProducts(); // Refresh
  };

  useEffect(() => {
    fetchProducts();
  }, [orgId, deviceId]);

  // ... render UI
}
```

## TypeScript Types

```typescript
interface PluginClientConfig {
  orgId: string;
  deviceId: string;
  baseUrl?: string;
  token?: string;
}

interface QueryNodesOptions {
  filter?: string;
  limit?: number;
  offset?: number;
  ports?: string[];
  runtime?: boolean;
}

interface CreateNodeInput {
  type: string;
  name: string;
  parentId?: string;
  settings?: Record<string, unknown>;
  data?: Record<string, unknown>;
  ui?: Record<string, unknown>;
  position?: { x: number; y: number };
}

interface UpdateNodeInput {
  name?: string;
  parentId?: string;
  settings?: Record<string, unknown>;
  data?: Record<string, unknown>;
  ui?: Record<string, unknown>;
  position?: { x: number; y: number };
}

class PluginClientError extends Error {
  status?: number;
  details?: unknown;
}
```

## Migration Guide

### Migrating from Manual Fetch

**Before:**
```typescript
const response = await fetch(`${baseUrl}/${orgId}/${deviceId}/query`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  },
  body: JSON.stringify({ filter: 'type is "plm.product"' }),
});
const result = await response.json();
const products = result.data || [];
```

**After:**
```typescript
const client = createPluginClient({ orgId, deviceId, baseUrl, token });
const products = await client.queryNodes({ filter: 'type is "plm.product"' });
```

### Migrating from RASClient

**Before:**
```typescript
import { RASClient, fetchAdapter } from '@rubix/sdk/ras/client';

const base = fetchAdapter();
const rasClient = new RASClient(baseUrl, async (req) => {
  if (token) req.headers = { ...req.headers, Authorization: `Bearer ${token}` };
  return base(req);
});

const result = await rasClient.query.create({
  orgId,
  deviceId,
  body: { filter: 'type is "plm.product"' },
});
const products = result.data || [];
```

**After:**
```typescript
import { createPluginClient } from '@rubix/sdk/plugin-client';

const client = createPluginClient({ orgId, deviceId, baseUrl, token });
const products = await client.queryNodes({ filter: 'type is "plm.product"' });
```

## FAQ

**Q: Can I still access the raw RAS client?**
Yes, use `client.getRASClient()` for advanced APIs.

**Q: How do I handle authentication?**
Pass the `token` parameter when creating the client. It's automatically injected into all requests.

**Q: What if I need to call an API not wrapped by this client?**
Use `client.getRASClient()` to access the full RAS client.

**Q: Does this work with all plugins?**
Yes! It's completely generic and works with any plugin.

**Q: What about performance?**
Creating a client is lightweight. For React, memoize with `useMemo` to avoid recreating on every render.

## Contributing

This client is part of the `rubix-plugin/frontend-sdk`. To add new methods:

1. Add the method to `PluginClient` class in `index.ts`
2. Document it in this README
3. Update the TypeScript types
4. Test in a real widget

## See Also

- [RAS Client Documentation](/home/user/code/go/nube/rubix-plugin/frontend-sdk/ras/)
- [PLM Plugin Example](/home/user/code/go/nube/rubix-plugin/nube.plm/)
- [Example Plugin](/home/user/code/go/nube/rubix-plugin/nubeio-example/)
