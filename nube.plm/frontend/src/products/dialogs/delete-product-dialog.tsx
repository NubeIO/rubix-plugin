/**
 * Delete product confirmation dialog
 */

import { useState } from 'react';
// @ts-ignore - SDK types are resolved at build time
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@rubix/sdk';
import { Product } from '../common/types';

interface DeleteProductDialogProps {
  open: boolean;
  product: Product;
  onClose: () => void;
  onConfirm: (productId: string) => Promise<void>;
}

export function DeleteProductDialog({ open, product, onClose, onConfirm }: DeleteProductDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm(product.id);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to delete product');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    if (isDeleting) return;
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open: boolean) => !open && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-[var(--rubix-muted-foreground)]">
          Are you sure you want to delete <strong>{product.name}</strong>
          {product.settings?.productCode && (
            <span> ({product.settings.productCode})</span>
          )}
          ? This action cannot be undone.
        </p>

        <DialogFooter>
          <Button onClick={handleClose} disabled={isDeleting} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isDeleting} variant="destructive">
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
