/**
 * Form data types
 */

export interface ProductFormData {
  name: string;
  productCode: string;
  description: string;
  status: string;
  price: string;
}

export type ProductFormErrors = Partial<Record<keyof ProductFormData, string>>;

export const DEFAULT_FORM_DATA: ProductFormData = {
  name: '',
  productCode: '',
  description: '',
  status: 'Design',
  price: '',
};
