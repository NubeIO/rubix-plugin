/**
 * Product table component
 */

// @ts-ignore - SDK types are resolved at build time
import { Button } from '@rubix/sdk';
import { Product, DisplaySettings } from '../../types';
import { formatPrice, formatProductCode } from '../../lib/utils';
import { CELL_PADDING } from '../../lib/constants';
import { EditIcon, TrashIcon, StatusBadge } from '../ui';

interface ProductTableProps {
  products: Product[];
  displaySettings: DisplaySettings;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  displaySettings,
  onEdit,
  onDelete,
}: ProductTableProps) {
  const cellPadding = displaySettings.compactMode ? CELL_PADDING.compact : CELL_PADDING.normal;

  return (
    <table
      className="w-full text-xs"
      style={{
        borderCollapse: 'collapse',
      }}
    >
      <thead>
        <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
          <th style={{ padding: cellPadding, fontWeight: 600 }}>Name</th>
          {displaySettings.showCode && (
            <th style={{ padding: cellPadding, fontWeight: 600 }}>Code</th>
          )}
          {displaySettings.showStatus && (
            <th style={{ padding: cellPadding, fontWeight: 600 }}>Status</th>
          )}
          {displaySettings.showPrice && (
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
          <th
            style={{
              padding: cellPadding,
              fontWeight: 600,
              textAlign: 'right',
              width: displaySettings.compactMode ? 60 : 80,
            }}
          >
            Actions
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
            <td style={{ padding: cellPadding }}>{product.name}</td>
            {displaySettings.showCode && (
              <td style={{ padding: cellPadding, color: '#666' }}>
                {formatProductCode(product.settings?.productCode)}
              </td>
            )}
            {displaySettings.showStatus && (
              <td style={{ padding: cellPadding }}>
                <StatusBadge status={product.settings?.status} />
              </td>
            )}
            {displaySettings.showPrice && (
              <td
                style={{
                  padding: cellPadding,
                  textAlign: 'right',
                  fontFamily: 'monospace',
                }}
              >
                {formatPrice(product.settings?.price)}
              </td>
            )}
            <td
              style={{
                padding: cellPadding,
                textAlign: 'right',
              }}
            >
              <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                <Button
                  onClick={() => onEdit(product)}
                  size={displaySettings.compactMode ? 'sm' : 'sm'}
                  variant="outline"
                  title="Edit product"
                >
                  <EditIcon size={displaySettings.compactMode ? 12 : 14} />
                </Button>
                <Button
                  onClick={() => onDelete(product)}
                  size={displaySettings.compactMode ? 'sm' : 'sm'}
                  variant="outline"
                  title="Delete product"
                  className="text-[var(--rubix-destructive)]"
                >
                  <TrashIcon size={displaySettings.compactMode ? 12 : 14} />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
