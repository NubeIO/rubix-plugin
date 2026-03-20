/**
 * Shared constants
 */

export const PLM_NODE_TYPES = {
  SERVICE: 'plm.service',
  PRODUCT: 'plm.product',
  PRODUCTION_RUN: 'plm.production-run',
  SERIALIZED_UNIT: 'plm.serialized-unit',
  WORK_ITEM: 'plm.work-item',
  DEPLOYMENT: 'plm.deployment',
  SITE: 'plm.site',
} as const;

export const DEFAULT_REFRESH_INTERVAL = 30000; // 30 seconds

export const CELL_PADDING = {
  compact: '6px 4px',
  normal: '8px 4px',
} as const;
