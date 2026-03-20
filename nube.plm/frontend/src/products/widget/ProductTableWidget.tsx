/**
 * Product Table Widget
 *
 * Feature-first architecture - all product code in products/
 * Refactored from 962 lines monolith to ~140 line orchestrator
 */

import { useState } from 'react';
// @ts-ignore - SDK types are resolved at build time
import { Button, Skeleton } from '@rubix/sdk';
import '@rubix/sdk/globals.css';

import { Product } from '../common/types';
import { useProducts } from '../common/hooks';
import { PlusIcon } from '../../shared/components/icons';
import { ProductTable } from '../components';
import { CreateProductDialog, EditProductDialog, DeleteProductDialog } from '../dialogs';

export interface WidgetSettings {
  display?: {
    showCode?: boolean;
    showStatus?: boolean;
    showPrice?: boolean;
    compactMode?: boolean;
  };
  refresh?: {
    interval?: number;
    enableAutoRefresh?: boolean;
  };
}

export interface ProductTableWidgetProps {
  orgId?: string;
  deviceId?: string;
  baseUrl?: string;
  token?: string;
  settings?: WidgetSettings;
  config?: Record<string, unknown>;
  nodeId?: string;
}

export default function ProductTableWidget({
  orgId,
  deviceId,
  baseUrl,
  token,
  settings,
  nodeId,
}: ProductTableWidgetProps) {
  // Parse settings with defaults
  const showCode = settings?.display?.showCode ?? true;
  const showStatus = settings?.display?.showStatus ?? true;
  const showPrice = settings?.display?.showPrice ?? true;
  const compactMode = settings?.display?.compactMode ?? false;
  const interval = (settings?.refresh?.interval ?? 30) * 1000;
  const autoRefresh = settings?.refresh?.enableAutoRefresh ?? true;

  // Products CRUD (includes PLM hierarchy initialization)
  const {
    products,
    loading: productsLoading,
    error: productsError,
    createProduct,
    updateProduct,
    deleteProduct,
    productsCollectionId,
    hierarchyLoading,
    hierarchyError,
  } = useProducts({
    orgId: orgId || '',
    deviceId: deviceId || '',
    baseUrl,
    token,
    autoRefresh,
    refreshInterval: interval,
  });

  // Dialog state
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Computed
  const canCreate = !!(orgId && deviceId && baseUrl && productsCollectionId);
  const loading = hierarchyLoading || productsLoading;
  const error = hierarchyError || productsError;

  const displaySettings = {
    showCode,
    showStatus,
    showPrice,
    compactMode,
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-3">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 text-sm">
        <div className="text-destructive mb-3">Error: {error}</div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="p-4">
        <div className="text-muted-foreground text-center mb-4 text-sm">
          No products found. Create one to get started.
        </div>
        <div className="text-center">
          <Button onClick={() => setCreateDialogOpen(true)} disabled={!canCreate} size="sm">
            <PlusIcon size={compactMode ? 12 : 14} />
            New Product
          </Button>
        </div>

        <CreateProductDialog
          open={createDialogOpen}
          onClose={() => setCreateDialogOpen(false)}
          onSubmit={createProduct}
        />
      </div>
    );
  }

  // Main content
  return (
    <div className="p-4 h-full overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} disabled={!canCreate} size="sm">
          <PlusIcon size={14} />
          New Product
        </Button>
      </div>

      {/* Table */}
      <ProductTable
        products={products}
        displaySettings={displaySettings}
        onEdit={(product) => setEditingProduct(product)}
        onDelete={(product) => setDeletingProduct(product)}
      />

      {/* Dialogs */}
      <CreateProductDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSubmit={createProduct}
      />

      {editingProduct && (
        <EditProductDialog
          open={true}
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={updateProduct}
        />
      )}

      {deletingProduct && (
        <DeleteProductDialog
          open={true}
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={deleteProduct}
        />
      )}
    </div>
  );
}
