/**
 * Product domain types
 */

export interface Product {
  id: string;
  name: string;
  settings?: ProductSettings;
}

export interface ProductSettings {
  productCode?: string;
  description?: string;
  status?: ProductStatus;
  price?: number;
}

export type ProductStatus = 'Design' | 'Prototype' | 'Production' | 'Discontinued';

export const PRODUCT_STATUSES: ProductStatus[] = [
  'Design',
  'Prototype',
  'Production',
  'Discontinued',
];
