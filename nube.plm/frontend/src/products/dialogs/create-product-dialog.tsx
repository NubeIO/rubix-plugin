/**
 * Create product dialog
 */

import { useState } from 'react';
// @ts-ignore - SDK types are resolved at build time
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@rubix/sdk';
import { ProductFormData, ProductFormErrors, DEFAULT_FORM_DATA } from '../common/types';
import { validateProductForm } from '../common/utils';
import { ProductFormFields } from '../components';

interface CreateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: ProductFormData) => Promise<void>;
}

export function CreateProductDialog({ open, onClose, onSubmit }: CreateProductDialogProps) {
  const [formData, setFormData] = useState<ProductFormData>(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState<ProductFormErrors>({});
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleChange = (field: keyof ProductFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { isValid, errors } = validateProductForm(formData);
    setFormErrors(errors);

    if (!isValid) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      await onSubmit(formData);
      setFormData(DEFAULT_FORM_DATA);
      setFormErrors({});
      onClose();
    } catch (err: any) {
      setCreateError(err.message || 'Failed to create product');
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    if (isCreating) return;
    setFormData(DEFAULT_FORM_DATA);
    setFormErrors({});
    setCreateError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open: boolean) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>

        {createError && (
          <div className="p-3 bg-[var(--rubix-destructive)]/10 text-[var(--rubix-destructive)] text-sm rounded-[var(--rubix-radius-md)] mb-4">
            {createError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <ProductFormFields
            formData={formData}
            formErrors={formErrors}
            disabled={isCreating}
            onChange={handleChange}
          />

          <DialogFooter>
            <Button type="button" onClick={handleClose} disabled={isCreating} variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? 'Creating...' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
