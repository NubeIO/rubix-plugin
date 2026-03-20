/**
 * Form validation utilities
 */

import { ProductFormData, ProductFormErrors } from '../../types';

export function validateProductForm(formData: ProductFormData): {
  isValid: boolean;
  errors: ProductFormErrors;
} {
  const errors: ProductFormErrors = {};

  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  }

  if (!formData.productCode.trim()) {
    errors.productCode = 'Product code is required';
  }

  if (formData.price && parseFloat(formData.price) < 0) {
    errors.price = 'Price must be 0 or greater';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
