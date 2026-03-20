import { useState, useEffect } from 'react';
import { createPluginClient } from '@rubix/sdk/plugin-client';
// @ts-ignore - SDK types are resolved at build time
import {
  Button,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Skeleton,
} from '@rubix/sdk';
import '@rubix/sdk/globals.css';

interface Product {
  id: string;
  name: string;
  settings: {
    productCode?: string;
    description?: string;
    status?: string;
    price?: number;
  };
}

interface WidgetSettings {
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

interface ProductTableWidgetProps {
  orgId?: string;
  deviceId?: string;
  baseUrl?: string;
  token?: string;
  settings?: WidgetSettings;
  config?: Record<string, unknown>;
}

interface ProductFormData {
  name: string;
  productCode: string;
  description: string;
  status: string;
  price: string;
}

export default function ProductTableWidget({
  orgId,
  deviceId,
  baseUrl,
  token,
  settings,
}: ProductTableWidgetProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    productCode: '',
    description: '',
    status: 'Design',
    price: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ProductFormData, string>>>({});
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [testClickCount, setTestClickCount] = useState(0);

  // DEBUG: Log props on mount and changes
  useEffect(() => {
    console.log('🔵 [PLM Widget] Props received:', {
      orgId,
      deviceId,
      baseUrl,
      token: token ? `${token.substring(0, 10)}...` : undefined,
      settings,
    });
  }, [orgId, deviceId, baseUrl, token, settings]);

  // DEBUG: Log dialog state changes
  useEffect(() => {
    console.log('🔵 [PLM Widget] createDialogOpen changed:', createDialogOpen);
  }, [createDialogOpen]);

  useEffect(() => {
    console.log('🔵 [PLM Widget] editDialogOpen changed:', editDialogOpen);
  }, [editDialogOpen]);

  useEffect(() => {
    console.log('🔵 [PLM Widget] deleteDialogOpen changed:', deleteDialogOpen);
  }, [deleteDialogOpen]);

  // Extract settings with defaults
  const showCode = settings?.display?.showCode ?? true;
  const showStatus = settings?.display?.showStatus ?? true;
  const showPrice = settings?.display?.showPrice ?? true;
  const compactMode = settings?.display?.compactMode ?? false;
  const interval = (settings?.refresh?.interval ?? 30) * 1000;
  const autoRefresh = settings?.refresh?.enableAutoRefresh ?? true;

  // Styling based on compact mode (using Tailwind classes now)
  const cellPadding = compactMode ? '6px 4px' : '8px 4px';

  const fetchProducts = async () => {
    if (!orgId || !deviceId) return;

    try {
      const client = createPluginClient({ orgId, deviceId, baseUrl, token });
      const products = await client.queryNodes({
        filter: 'type is "plm.product"',
      });

      setProducts(products as Product[]);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ProductFormData, string>> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.productCode.trim()) {
      errors.productCode = 'Product code is required';
    }

    if (formData.price && parseFloat(formData.price) < 0) {
      errors.price = 'Price must be 0 or greater';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createProduct = async () => {
    if (!orgId || !deviceId || !validateForm()) return;

    setIsCreating(true);
    setCreateError(null);

    try {
      const client = createPluginClient({ orgId, deviceId, baseUrl, token });
      await client.createNode({
        type: 'plm.product',
        name: formData.name,
        settings: {
          productCode: formData.productCode,
          description: formData.description || undefined,
          status: formData.status,
          price: formData.price ? parseFloat(formData.price) : undefined,
        },
      });

      // Success - close dialog and refresh
      setCreateDialogOpen(false);
      setFormData({
        name: '',
        productCode: '',
        description: '',
        status: 'Design',
        price: '',
      });
      setFormErrors({});
      fetchProducts();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProduct();
  };

  const handleCloseDialog = () => {
    if (isCreating) return; // Prevent closing during creation
    setCreateDialogOpen(false);
    setFormData({
      name: '',
      productCode: '',
      description: '',
      status: 'Design',
      price: '',
    });
    setFormErrors({});
    setCreateError(null);
  };

  const handleEditClick = (product: Product) => {
    console.log('🔵 [PLM Widget] Edit button clicked:', product.id);
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      productCode: product.settings.productCode || '',
      description: product.settings.description || '',
      status: product.settings.status || 'Design',
      price: product.settings.price !== undefined ? product.settings.price.toString() : '',
    });
    setEditDialogOpen(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProduct();
  };

  const updateProduct = async () => {
    if (!orgId || !deviceId || !selectedProduct || !validateForm()) return;

    setIsUpdating(true);
    setCreateError(null);

    try {
      const client = createPluginClient({ orgId, deviceId, baseUrl, token });
      await client.updateNode(selectedProduct.id, {
        name: formData.name,
        settings: {
          productCode: formData.productCode,
          description: formData.description || undefined,
          status: formData.status,
          price: formData.price ? parseFloat(formData.price) : undefined,
        },
      });

      setEditDialogOpen(false);
      setSelectedProduct(null);
      setFormData({
        name: '',
        productCode: '',
        description: '',
        status: 'Design',
        price: '',
      });
      setFormErrors({});
      fetchProducts();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCloseEditDialog = () => {
    if (isUpdating) return;
    setEditDialogOpen(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      productCode: '',
      description: '',
      status: 'Design',
      price: '',
    });
    setFormErrors({});
    setCreateError(null);
  };

  const handleDeleteClick = (product: Product) => {
    console.log('🔵 [PLM Widget] Delete button clicked:', product.id);
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const handleTestClick = () => {
    console.log('🔵 [PLM Widget] TEST BUTTON CLICKED!');
    const newCount = testClickCount + 1;
    setTestClickCount(newCount);
    alert(`Test button works! Click count: ${newCount}`);
  };

  const handleCreateClick = () => {
    console.log('🔵 [PLM Widget] Create button clicked');
    console.log('🔵 [PLM Widget] canCreate:', canCreate);
    console.log('🔵 [PLM Widget] Current state:', { createDialogOpen, orgId, deviceId, baseUrl });
    setCreateDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!orgId || !deviceId || !selectedProduct) return;

    setIsDeleting(true);

    try {
      const client = createPluginClient({ orgId, deviceId, baseUrl, token });
      await client.deleteNode(selectedProduct.id);

      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteDialog = () => {
    if (isDeleting) return;
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchProducts();

    if (!autoRefresh) return;

    const intervalId = setInterval(fetchProducts, interval);
    return () => clearInterval(intervalId);
  }, [orgId, deviceId, baseUrl, token, interval, autoRefresh]);

  // DEBUG: Show props status
  const canCreate = !!(orgId && deviceId && baseUrl);

  if (loading) {
    return (
      <div className="p-4">
        <div className="mb-3">
          <Skeleton className="h-4 w-32 mb-4" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
        {/* DEBUG TEST BUTTON */}
        <Button onClick={handleTestClick} size="sm" variant="secondary">
          🧪 TEST CLICK (Count: {testClickCount})
        </Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm">
        <div className="text-destructive mb-3">Error: {error}</div>
        {/* DEBUG TEST BUTTON */}
        <Button onClick={handleTestClick} size="sm" variant="secondary">
          🧪 TEST CLICK (Count: {testClickCount})
        </Button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="p-4">
        {/* DEBUG: Props info */}
        <div className="text-xs text-muted-foreground mb-3 font-mono">
          Props: orgId={orgId ? '✅' : '❌'} deviceId={deviceId ? '✅' : '❌'} baseUrl={baseUrl ? '✅' : '❌'}
        </div>

        {/* DEBUG TEST BUTTON */}
        <div className="text-center mb-4">
          <Button onClick={handleTestClick} size="sm" variant="secondary">
            🧪 TEST CLICK (Count: {testClickCount})
          </Button>
        </div>

        <div className="text-muted-foreground text-center mb-4 text-sm">
          No products found. Create one to get started.
        </div>
        <div className="text-center">
          <Button onClick={handleCreateClick} disabled={!canCreate} size="sm">
            <PlusIcon size={compactMode ? 12 : 14} />
            New Product
          </Button>
        </div>
        {createDialogOpen && (
          <CreateProductDialog
            formData={formData}
            formErrors={formErrors}
            createError={createError}
            isCreating={isCreating}
            onSubmit={handleSubmit}
            onChange={setFormData}
            onClose={handleCloseDialog}
            compactMode={compactMode}
          />
        )}
      </div>
    );
  }

  return (
    <div className="p-4 h-full overflow-auto">
      {/* DEBUG: Props info */}
      <div className="text-xs text-muted-foreground mb-2 font-mono">
        Props: orgId={orgId ? '✅' : '❌'} deviceId={deviceId ? '✅' : '❌'} baseUrl={baseUrl ? '✅' : '❌'}
      </div>

      {/* DEBUG TEST BUTTON */}
      <div className="mb-3">
        <Button onClick={handleTestClick} size="sm" variant="secondary">
          🧪 TEST CLICK (Count: {testClickCount})
        </Button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-muted-foreground">
          {products.length} product{products.length !== 1 ? 's' : ''}
        </div>
        <Button onClick={handleCreateClick} disabled={!canCreate} size="sm">
          <PlusIcon size={14} />
          New Product
        </Button>
      </div>

      <table
        className="w-full text-xs"
        style={{
          borderCollapse: 'collapse',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '1px solid #ddd', textAlign: 'left' }}>
            <th style={{ padding: cellPadding, fontWeight: 600 }}>Name</th>
            {showCode && (
              <th style={{ padding: cellPadding, fontWeight: 600 }}>Code</th>
            )}
            {showStatus && (
              <th style={{ padding: cellPadding, fontWeight: 600 }}>Status</th>
            )}
            {showPrice && (
              <th
                style={{
                  padding: cellPadding,
                  fontWeight: 600,
                  textAlign: 'right',
                }}
              >
                Price
              </th>
            )}
            <th
              style={{
                padding: cellPadding,
                fontWeight: 600,
                textAlign: 'right',
                width: compactMode ? 60 : 80,
              }}
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              style={{
                borderBottom: '1px solid #f0f0f0',
                transition: 'background 0.15s',
              }}
            >
              <td style={{ padding: cellPadding }}>{product.name}</td>
              {showCode && (
                <td style={{ padding: cellPadding, color: '#666' }}>
                  {product.settings.productCode || '—'}
                </td>
              )}
              {showStatus && (
                <td style={{ padding: cellPadding }}>
                  <StatusBadge status={product.settings.status} />
                </td>
              )}
              {showPrice && (
                <td
                  style={{
                    padding: cellPadding,
                    textAlign: 'right',
                    fontFamily: 'monospace',
                  }}
                >
                  {product.settings.price != null
                    ? `$${product.settings.price.toFixed(2)}`
                    : '—'}
                </td>
              )}
              <td
                style={{
                  padding: cellPadding,
                  textAlign: 'right',
                }}
              >
                <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                  <Button
                    onClick={() => handleEditClick(product)}
                    size={compactMode ? 'sm' : 'sm'}
                    variant="outline"
                    title="Edit product"
                  >
                    <EditIcon size={compactMode ? 12 : 14} />
                  </Button>
                  <Button
                    onClick={() => handleDeleteClick(product)}
                    size={compactMode ? 'sm' : 'sm'}
                    variant="outline"
                    title="Delete product"
                    className="text-[var(--rubix-destructive)]"
                  >
                    <TrashIcon size={compactMode ? 12 : 14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {createDialogOpen && (
        <CreateProductDialog
          formData={formData}
          formErrors={formErrors}
          createError={createError}
          isCreating={isCreating}
          onSubmit={handleSubmit}
          onChange={setFormData}
          onClose={handleCloseDialog}
          compactMode={compactMode}
        />
      )}

      {editDialogOpen && selectedProduct && (
        <EditProductDialog
          product={selectedProduct}
          formData={formData}
          formErrors={formErrors}
          updateError={createError}
          isUpdating={isUpdating}
          onSubmit={handleUpdateSubmit}
          onChange={setFormData}
          onClose={handleCloseEditDialog}
          compactMode={compactMode}
        />
      )}

      {deleteDialogOpen && selectedProduct && (
        <DeleteConfirmDialog
          product={selectedProduct}
          isDeleting={isDeleting}
          onConfirm={confirmDelete}
          onClose={handleCloseDeleteDialog}
          compactMode={compactMode}
        />
      )}
    </div>
  );
}

function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function EditIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

interface CreateProductDialogProps {
  formData: ProductFormData;
  formErrors: Partial<Record<keyof ProductFormData, string>>;
  createError: string | null;
  isCreating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: ProductFormData) => void;
  onClose: () => void;
  compactMode: boolean;
}

function CreateProductDialog({
  formData,
  formErrors,
  createError,
  isCreating,
  onSubmit,
  onChange,
  onClose,
  compactMode,
}: CreateProductDialogProps) {
  const handleChange = (field: keyof ProductFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && !isCreating && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>

        {createError && (
          <div className="p-3 bg-[var(--rubix-destructive)]/10 text-[var(--rubix-destructive)] text-sm rounded-[var(--rubix-radius-md)] mb-4">
            {createError}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <Label>
                Name <span className="text-[var(--rubix-destructive)]">*</span>
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
                className={formErrors.name ? 'border-[var(--rubix-destructive)]' : ''}
                disabled={isCreating}
                autoFocus
              />
              {formErrors.name && (
                <div className="text-xs text-[var(--rubix-destructive)] mt-1">{formErrors.name}</div>
              )}
            </div>

            <div>
              <Label>
                Product Code <span className="text-[var(--rubix-destructive)]">*</span>
              </Label>
              <Input
                type="text"
                value={formData.productCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('productCode', e.target.value)}
                className={formErrors.productCode ? 'border-[var(--rubix-destructive)]' : ''}
                disabled={isCreating}
                placeholder="e.g., WP-001"
              />
              {formErrors.productCode && (
                <div className="text-xs text-[var(--rubix-destructive)] mt-1">{formErrors.productCode}</div>
              )}
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
                className="flex min-h-[60px] w-full rounded-[var(--rubix-radius-md)] border border-[var(--rubix-input)] bg-[var(--rubix-background)] px-3 py-2 text-sm placeholder:text-[var(--rubix-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rubix-ring)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isCreating}
                placeholder="Optional description"
              />
            </div>

            <div>
              <Label>Status</Label>
              <select
                value={formData.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('status', e.target.value)}
                className="flex h-10 w-full rounded-[var(--rubix-radius-md)] border border-[var(--rubix-input)] bg-[var(--rubix-background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rubix-ring)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isCreating}
              >
                <option value="Design">Design</option>
                <option value="Prototype">Prototype</option>
                <option value="Production">Production</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>

            <div>
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('price', e.target.value)}
                className={formErrors.price ? 'border-[var(--rubix-destructive)]' : ''}
                disabled={isCreating}
                placeholder="0.00"
              />
              {formErrors.price && (
                <div className="text-xs text-[var(--rubix-destructive)] mt-1">{formErrors.price}</div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={onClose} disabled={isCreating} variant="outline">
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

interface EditProductDialogProps {
  product: Product;
  formData: ProductFormData;
  formErrors: Partial<Record<keyof ProductFormData, string>>;
  updateError: string | null;
  isUpdating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (data: ProductFormData) => void;
  onClose: () => void;
  compactMode: boolean;
}

function EditProductDialog({
  formData,
  formErrors,
  updateError,
  isUpdating,
  onSubmit,
  onChange,
  onClose,
}: EditProductDialogProps) {
  const handleChange = (field: keyof ProductFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && !isUpdating && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        {updateError && (
          <div className="p-3 bg-[var(--rubix-destructive)]/10 text-[var(--rubix-destructive)] text-sm rounded-[var(--rubix-radius-md)] mb-4">
            {updateError}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="space-y-4">
            <div>
              <Label>
                Name <span className="text-[var(--rubix-destructive)]">*</span>
              </Label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('name', e.target.value)}
                className={formErrors.name ? 'border-[var(--rubix-destructive)]' : ''}
                disabled={isUpdating}
                autoFocus
              />
              {formErrors.name && (
                <div className="text-xs text-[var(--rubix-destructive)] mt-1">{formErrors.name}</div>
              )}
            </div>

            <div>
              <Label>
                Product Code <span className="text-[var(--rubix-destructive)]">*</span>
              </Label>
              <Input
                type="text"
                value={formData.productCode}
                className={`${formErrors.productCode ? 'border-[var(--rubix-destructive)]' : ''} bg-[var(--rubix-muted)]`}
                disabled={true}
                title="Product code cannot be changed"
              />
              {formErrors.productCode && (
                <div className="text-xs text-[var(--rubix-destructive)] mt-1">{formErrors.productCode}</div>
              )}
              <div className="text-xs text-[var(--rubix-muted-foreground)] mt-1">
                Product code cannot be changed after creation
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <textarea
                value={formData.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange('description', e.target.value)}
                className="flex min-h-[60px] w-full rounded-[var(--rubix-radius-md)] border border-[var(--rubix-input)] bg-[var(--rubix-background)] px-3 py-2 text-sm placeholder:text-[var(--rubix-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rubix-ring)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isUpdating}
              />
            </div>

            <div>
              <Label>Status</Label>
              <select
                value={formData.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleChange('status', e.target.value)}
                className="flex h-10 w-full rounded-[var(--rubix-radius-md)] border border-[var(--rubix-input)] bg-[var(--rubix-background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rubix-ring)] disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isUpdating}
              >
                <option value="Design">Design</option>
                <option value="Prototype">Prototype</option>
                <option value="Production">Production</option>
                <option value="Discontinued">Discontinued</option>
              </select>
            </div>

            <div>
              <Label>Price</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('price', e.target.value)}
                className={formErrors.price ? 'border-[var(--rubix-destructive)]' : ''}
                disabled={isUpdating}
              />
              {formErrors.price && (
                <div className="text-xs text-[var(--rubix-destructive)] mt-1">{formErrors.price}</div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" onClick={onClose} disabled={isUpdating} variant="outline">
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

interface DeleteConfirmDialogProps {
  product: Product;
  isDeleting: boolean;
  onConfirm: () => void;
  onClose: () => void;
  compactMode: boolean;
}

function DeleteConfirmDialog({
  product,
  isDeleting,
  onConfirm,
  onClose,
}: DeleteConfirmDialogProps) {
  return (
    <Dialog open={true} onOpenChange={(open: boolean) => !open && !isDeleting && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-[var(--rubix-muted-foreground)]">
          Are you sure you want to delete <strong>{product.name}</strong>
          {product.settings.productCode && (
            <span> ({product.settings.productCode})</span>
          )}
          ? This action cannot be undone.
        </p>

        <DialogFooter>
          <Button onClick={onClose} disabled={isDeleting} variant="outline">
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isDeleting} variant="destructive">
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function StatusBadge({ status }: { status?: string }) {
  const variantMap: Record<string, 'default' | 'warning' | 'success' | 'secondary'> = {
    Design: 'default',
    Prototype: 'warning',
    Production: 'success',
    Discontinued: 'secondary',
  };

  const variant = variantMap[status || ''] || 'secondary';

  return (
    <Badge variant={variant}>
      {status || 'Unknown'}
    </Badge>
  );
}
