/**
 * TypeScript types for Rubix plugins
 */

/**
 * Props passed to plugin widgets
 */
export interface PluginWidgetProps {
  /** Organization ID */
  orgId?: string;
  /** Device ID */
  deviceId?: string;
  /** API base URL (defaults to /api/v1) */
  baseUrl?: string;
  /** Authentication token */
  token?: string;
  /** Widget-specific settings from widget configuration */
  settings?: Record<string, unknown>;
  /** Additional plugin configuration */
  config?: Record<string, unknown>;
}

/**
 * Props passed to plugin pages
 */
export interface PluginPageProps {
  /** Organization ID */
  orgId?: string;
  /** Device ID */
  deviceId?: string;
  /** API base URL (defaults to /api/v1) */
  baseUrl?: string;
  /** Authentication token */
  token?: string;
}

/**
 * Generic API response wrapper
 */
export interface RubixApiResponse<T> {
  data: T;
  meta?: {
    timestamp?: string;
    total?: number;
    [key: string]: unknown;
  };
}

/**
 * Rubix Node (from RAS types)
 */
export interface RubixNode {
  id: string;
  name: string;
  type: string;
  parentId?: string;
  settings?: Record<string, unknown>;
  data?: Record<string, unknown>;
  ui?: Record<string, unknown>;
  position?: { x: number; y: number };
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Query result wrapper
 */
export interface QueryResult {
  nodes: RubixNode[];
  total: number;
}

/**
 * Component variant types
 */
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
