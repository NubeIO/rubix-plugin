import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  settings: {
    productCode?: string;
    description?: string;
    status?: string;
    price?: number;
  };
}

interface ProductTableWidgetProps {
  orgId?: string;
  deviceId?: string;
  baseUrl?: string;
  token?: string;
  config?: Record<string, unknown>;
}

export default function ProductTableWidget({
  orgId,
  deviceId,
  baseUrl,
  token,
}: ProductTableWidgetProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orgId || !deviceId) return;

    const fetchProducts = async () => {
      try {
        const response = await fetch(`${baseUrl}/${orgId}/${deviceId}/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify({
            query: 'type is "plm.product"',
          }),
        });

        if (!response.ok) throw new Error('Failed to fetch products');

        const result = await response.json();
        setProducts(result.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchProducts, 30000);
    return () => clearInterval(interval);
  }, [orgId, deviceId, baseUrl, token]);

  if (loading) {
    return (
      <div style={{ padding: 16, color: '#666', fontSize: 12 }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 16, color: '#e74c3c', fontSize: 12 }}>
        Error: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          padding: 16,
          color: '#999',
          textAlign: 'center',
          fontSize: 12,
        }}
      >
        No products found. Create one to get started.
      </div>
    );
  }

  return (
    <div style={{ padding: 16, height: '100%', overflow: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: 12,
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: '8px 4px', fontWeight: 600 }}>Name</th>
            <th style={{ padding: '8px 4px', fontWeight: 600 }}>Code</th>
            <th style={{ padding: '8px 4px', fontWeight: 600 }}>Status</th>
            <th
              style={{
                padding: '8px 4px',
                fontWeight: 600,
                textAlign: 'right',
              }}
            >
              Price
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              style={{
                borderBottom: '1px solid #f0f0f0',
                transition: 'background 0.15s',
              }}
            >
              <td style={{ padding: '8px 4px' }}>{product.name}</td>
              <td style={{ padding: '8px 4px', color: '#666' }}>
                {product.settings.productCode || '—'}
              </td>
              <td style={{ padding: '8px 4px' }}>
                <StatusBadge status={product.settings.status} />
              </td>
              <td
                style={{
                  padding: '8px 4px',
                  textAlign: 'right',
                  fontFamily: 'monospace',
                }}
              >
                {product.settings.price != null
                  ? `$${product.settings.price.toFixed(2)}`
                  : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 12, fontSize: 11, color: '#999' }}>
        {products.length} product{products.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const colors: Record<string, string> = {
    Design: '#3b82f6',
    Prototype: '#f59e0b',
    Production: '#10b981',
    Discontinued: '#6b7280',
  };

  const color = colors[status || ''] || '#6b7280';

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 500,
        backgroundColor: `${color}20`,
        color,
      }}
    >
      {status || 'Unknown'}
    </span>
  );
}
