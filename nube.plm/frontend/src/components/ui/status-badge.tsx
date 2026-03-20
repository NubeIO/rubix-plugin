/**
 * Status badge component
 */

// @ts-ignore - SDK types are resolved at build time
import { Badge } from '@rubix/sdk';
import { ProductStatus } from '../../types';

interface StatusBadgeProps {
  status?: ProductStatus | string;
}

const VARIANT_MAP: Record<string, 'default' | 'warning' | 'success' | 'secondary'> = {
  Design: 'default',
  Prototype: 'warning',
  Production: 'success',
  Discontinued: 'secondary',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const variant = VARIANT_MAP[status || ''] || 'secondary';

  return (
    <Badge variant={variant}>
      {status || 'Unknown'}
    </Badge>
  );
}
