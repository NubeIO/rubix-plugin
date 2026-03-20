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

interface WidgetSettings {
  display?: {
    showCode?: boolean;
    showStatus?: boolean;
    showPrice?: boolean;
    compactMode?: boolean;
  };
  refresh?: {
    interval?: number;
    enableAutoRefresh?: boolean;
  };
}

interface ProductTableWidgetProps {
  orgId?: string;
  deviceId?: string;
  baseUrl?: string;
  token?: string;
  settings?: WidgetSettings;
  config?: Record<string, unknown>;
}

export default function ProductTableWidget({
  orgId,
  deviceId,
  baseUrl,
  token,
  settings,
}: ProductTableWidgetProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract settings with defaults
  const showCode = settings?.display?.showCode ?? true;
  const showStatus = settings?.display?.showStatus ?? true;
  const showPrice = settings?.display?.showPrice ?? true;
  const compactMode = settings?.display?.compactMode ?? false;
  const interval = (settings?.refresh?.interval ?? 30) * 1000;
  const autoRefresh = settings?.refresh?.enableAutoRefresh ?? true;

  // Styling based on compact mode
  const padding = compactMode ? 12 : 16;
  const cellPadding = compactMode ? '6px 4px' : '8px 4px';
  const fontSize = compactMode ? 11 : 12;

  const fetchProducts = async () => {
    if (!orgId || !deviceId) return;

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
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    if (!autoRefresh) return;

    const intervalId = setInterval(fetchProducts, interval);
    return () => clearInterval(intervalId);
  }, [orgId, deviceId, baseUrl, token, interval, autoRefresh]);

  if (loading) {
    return (
      <div style={{ padding, color: '#666', fontSize }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding, color: '#e74c3c', fontSize }}>
        Error: {error}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div
        style={{
          padding,
          color: '#999',
          textAlign: 'center',
          fontSize,
        }}
      >
        No products found. Create one to get started.
      </div>
    );
  }

  return (
    <div style={{ padding, height: '100%', overflow: 'auto' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize,
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: cellPadding, fontWeight: 600 }}>Name</th>
            {showCode && (
              <th style={{ padding: cellPadding, fontWeight: 600 }}>Code</th>
            )}
            {showStatus && (
              <th style={{ padding: cellPadding, fontWeight: 600 }}>Status</th>
            )}
            {showPrice && (
              <th
                style={{
                  padding: cellPadding,
                  fontWeight: 600,
                  textAlign: 'right',
                }}
              >
                Price
              </th>
            )}
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
              <td style={{ padding: cellPadding }}>{product.name}</td>
              {showCode && (
                <td style={{ padding: cellPadding, color: '#666' }}>
                  {product.settings.productCode || '—'}
                </td>
              )}
              {showStatus && (
                <td style={{ padding: cellPadding }}>
                  <StatusBadge status={product.settings.status} compact={compactMode} />
                </td>
              )}
              {showPrice && (
                <td
                  style={{
                    padding: cellPadding,
                    textAlign: 'right',
                    fontFamily: 'monospace',
                  }}
                >
                  {product.settings.price != null
                    ? `$${product.settings.price.toFixed(2)}`
                    : '—'}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          marginTop: compactMode ? 8 : 12,
          fontSize: compactMode ? 10 : 11,
          color: '#999',
        }}
      >
        {products.length} product{products.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

function StatusBadge({ status, compact }: { status?: string; compact?: boolean }) {
  const colors: Record<string, string> = {
    Design: '#3b82f6',
    Prototype: '#f59e0b',
    Production: '#10b981',
    Discontinued: '#6b7280',
  };

  const color = colors[status || ''] || '#6b7280';
  const fontSize = compact ? 10 : 11;
  const padding = compact ? '1px 6px' : '2px 8px';

  return (
    <span
      style={{
        display: 'inline-block',
        padding,
        borderRadius: 4,
        fontSize,
        fontWeight: 500,
        backgroundColor: `${color}20`,
        color,
      }}
    >
      {status || 'Unknown'}
    </span>
  );
}
