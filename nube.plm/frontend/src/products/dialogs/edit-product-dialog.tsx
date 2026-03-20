/**
 * Edit product dialog
 */

import { useState, useEffect } from 'react';
// @ts-ignore - SDK types are resolved at build time
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@rubix/sdk';
import { Product, ProductFormData, ProductFormErrors } from '../common/types';
import { validateProductForm } from '../common/utils';
import { ProductFormFields } from '../components';

interface EditProductDialogProps {
  open: boolean;
  product: Product;
  onClose: () => void;
  onSubmit: (productId: string, formData: ProductFormData) => Promise<void>;
}

export function EditProductDialog({ open, product, onClose, onSubmit }: EditProductDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product.name,
    productCode: product.settings?.productCode || '',
    description: product.settings?.description || '',
    status: product.settings?.status || 'Design',
    price: product.settings?.price !== undefined ? product.settings.price.toString() : '',
  });
  const [formErrors, setFormErrors] = useState<ProductFormErrors>({});
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setFormData({
      name: product.name,
      productCode: product.settings?.productCode || '',
      description: product.settings?.description || '',
      status: product.settings?.status || 'Design',
      price: product.settings?.price !== undefined ? product.settings.price.toString() : '',
    });
  }, [product]);

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateProductForm(formData);
    setFormErrors(errors);

    if (!isValid) return;

    setIsUpdating(true);
    setUpdateError(null);

    try {
      await onSubmit(product.id, formData);
      onClose();
    } catch (err: any) {
      setUpdateError(err.message || 'Failed to update product');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClose = () => {
    if (isUpdating) return;
    setFormErrors({});
    setUpdateError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open: boolean) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        {updateError && (
          <div className="p-3 bg-[var(--rubix-destructive)]/10 text-[var(--rubix-destructive)] text-sm rounded-[var(--rubix-radius-md)] mb-4">
            {updateError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <ProductFormFields
            formData={formData}
            formErrors={formErrors}
            disabled={isUpdating}
            isEditing={true}
            onChange={handleChange}
          />

          <DialogFooter>
            <Button type="button" onClick={handleClose} disabled={isUpdating} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
