/**
 * RAS Client Utilities
 *
 * DO NOT MODIFY client.ts or types.ts - they are auto-generated from RAS YAML.
 * Add helper utilities here instead.
 */

/**
 * Backend Response Structure
 *
 * The backend wraps all successful responses in a standard envelope:
 * ```json
 * {
 *   "data": { ... actual response ... },
 *   "meta": {
 *     "timestamp": "2025-11-02T09:34:22Z",
 *     "total": 10,
 *     "cached": false
 *   }
 * }
 * ```
 *
 * The RAS client's BaseClient.request() method already unwraps this by returning `res.data`.
 * So when you call `rasClient.nodes.get()`, you get the actual data directly, not wrapped.
 *
 * However, in some edge cases or when using fetch() directly, you may need to unwrap manually.
 */

export interface RASResponse<T> {
  data: T;
  meta?: {
    timestamp?: string;
    source?: string;
    cached?: boolean;
    total?: number;
    page?: number;
    pageSize?: number;
  };
}

/**
 * Unwraps a RAS response envelope to get the actual data
 *
 * Use this when:
 * - Making direct fetch() calls instead of using rasClient
 * - Dealing with raw responses that haven't been unwrapped
 *
 * DO NOT use this with rasClient methods - they already unwrap!
 *
 * @example
 * ```typescript
 * // With direct fetch (manual unwrapping needed)
 * const response = await fetch('/api/v1/orgs/org1/nodes');
 * const json = await response.json();
 * const nodes = unwrapRASResponse(json);
 *
 * // With rasClient (already unwrapped - don't use this function!)
 * const nodes = await rasClient.nodes.list({ orgId, deviceId });
 * // nodes is already unwrapped!
 * ```
 */
export function unwrapRASResponse<T>(response: RASResponse<T> | T): T {
  if (response && typeof response === 'object' && 'data' in response) {
    return (response as RASResponse<T>).data;
  }
  return response as T;
}

/**
 * Checks if a value is a wrapped RAS response
 */
function isRASResponse<T>(value: any): value is RASResponse<T> {
  return (
    value && typeof value === 'object' && 'data' in value && 'meta' in value
  );
}

/**
 * Type guard to safely access RAS client results
 *
 * The RAS client already unwraps responses, but this helps with type safety
 * when the exact structure is uncertain.
 */
function ensureUnwrapped<T>(value: RASResponse<T> | T): T {
  return unwrapRASResponse(value);
}
