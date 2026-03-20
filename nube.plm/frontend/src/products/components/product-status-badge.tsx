/**
 * Product status badge component
 */

// @ts-ignore - SDK types are resolved at build time
import { Badge } from '@rubix/sdk';
import { ProductStatus } from '../common/types';

interface ProductStatusBadgeProps {
  status?: ProductStatus | string;
}

const VARIANT_MAP: Record<string, 'default' | 'warning' | 'success' | 'secondary'> = {
  Design: 'default',
  Prototype: 'warning',
  Production: 'success',
  Discontinued: 'secondary',
};

export function ProductStatusBadge({ status }: ProductStatusBadgeProps) {
  const variant = VARIANT_MAP[status || ''] || 'secondary';

  return (
    <Badge variant={variant}>
      {status || 'Unknown'}
    </Badge>
  );
}
