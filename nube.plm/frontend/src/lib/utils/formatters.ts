/**
 * Data formatting utilities
 */

export function formatPrice(price?: number): string {
  if (price == null) return '—';
  return `$${price.toFixed(2)}`;
}

export function formatProductCode(code?: string): string {
  return code || '—';
}
