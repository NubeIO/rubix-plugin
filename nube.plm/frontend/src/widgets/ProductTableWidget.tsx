import { useState, useEffect } from 'react';

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

  // Extract settings with defaults
  const showCode = settings?.display?.showCode ?? true;
  const showStatus = settings?.display?.showStatus ?? true;
  const showPrice = settings?.display?.showPrice ?? true;
  const compactMode = settings?.display?.compactMode ?? false;
  const interval = (settings?.refresh?.interval ?? 30) * 1000;
  const autoRefresh = settings?.refresh?.enableAutoRefresh ?? true;

  // Styling based on compact mode
  const padding = compactMode ? 12 : 16;
  const cellPadding = compactMode ? '6px 4px' : '8px 4px';
  const fontSize = compactMode ? 11 : 12;

  const fetchProducts = async () => {
    if (!orgId || !deviceId) return;

    try {
      const response = await fetch(`${baseUrl}/${orgId}/${deviceId}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          filter: 'type is "plm.product"',
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch products');

      const result = await response.json();
      setProducts(result.data || []);
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
      const response = await fetch(`${baseUrl}/${orgId}/${deviceId}/nodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          type: 'plm.product',
          name: formData.name,
          settings: {
            productCode: formData.productCode,
            description: formData.description || undefined,
            status: formData.status,
            price: formData.price ? parseFloat(formData.price) : undefined,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create product');
      }

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
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create product');
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
      const response = await fetch(`${baseUrl}/${orgId}/${deviceId}/nodes/${selectedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          name: formData.name,
          settings: {
            productCode: formData.productCode,
            description: formData.description || undefined,
            status: formData.status,
            price: formData.price ? parseFloat(formData.price) : undefined,
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update product');
      }

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
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to update product');
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
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!orgId || !deviceId || !selectedProduct) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`${baseUrl}/${orgId}/${deviceId}/nodes/${selectedProduct.id}`, {
        method: 'DELETE',
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setDeleteDialogOpen(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
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

  if (loading) {
    return (
      <div style={{ padding, color: '#666', fontSize }}>
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding, color: '#e74c3c', fontSize }}>
        Error: {error}
      </div>
    );
  }

  const canCreate = !!(orgId && deviceId && baseUrl);

  if (products.length === 0) {
    return (
      <div style={{ padding }}>
        <div
          style={{
            color: '#999',
            textAlign: 'center',
            fontSize,
            marginBottom: 16,
          }}
        >
          No products found. Create one to get started.
        </div>
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => setCreateDialogOpen(true)}
            disabled={!canCreate}
            style={{
              padding: '8px 16px',
              fontSize: 12,
              fontWeight: 500,
              color: canCreate ? '#fff' : '#999',
              backgroundColor: canCreate ? '#3b82f6' : '#e5e7eb',
              border: 'none',
              borderRadius: 4,
              cursor: canCreate ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <PlusIcon />
            New Product
          </button>
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
    <div style={{ padding, height: '100%', overflow: 'auto' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: compactMode ? 8 : 12,
        }}
      >
        <div style={{ fontSize: compactMode ? 10 : 11, color: '#999' }}>
          {products.length} product{products.length !== 1 ? 's' : ''}
        </div>
        <button
          onClick={() => setCreateDialogOpen(true)}
          disabled={!canCreate}
          style={{
            padding: compactMode ? '4px 8px' : '6px 12px',
            fontSize: compactMode ? 10 : 11,
            fontWeight: 500,
            color: canCreate ? '#fff' : '#999',
            backgroundColor: canCreate ? '#3b82f6' : '#e5e7eb',
            border: 'none',
            borderRadius: 4,
            cursor: canCreate ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <PlusIcon size={compactMode ? 12 : 14} />
          New Product
        </button>
      </div>

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize,
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
                  <StatusBadge status={product.settings.status} compact={compactMode} />
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
                  <button
                    onClick={() => handleEditClick(product)}
                    style={{
                      padding: compactMode ? '2px 6px' : '4px 8px',
                      fontSize: compactMode ? 10 : 11,
                      border: '1px solid #ddd',
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      color: '#3b82f6',
                    }}
                    title="Edit product"
                  >
                    <EditIcon size={compactMode ? 12 : 14} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(product)}
                    style={{
                      padding: compactMode ? '2px 6px' : '4px 8px',
                      fontSize: compactMode ? 10 : 11,
                      border: '1px solid #ddd',
                      borderRadius: 3,
                      backgroundColor: '#fff',
                      cursor: 'pointer',
                      color: '#e74c3c',
                    }}
                    title="Delete product"
                  >
                    <TrashIcon size={compactMode ? 12 : 14} />
                  </button>
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isCreating) {
      onClose();
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    fontSize: 12,
    border: '1px solid #ddd',
    borderRadius: 4,
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 4,
    color: '#333',
  };

  const errorStyle = {
    fontSize: 10,
    color: '#e74c3c',
    marginTop: 4,
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isCreating) {
          onClose();
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 24,
          width: '90%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            Create Product
          </h2>
          <button
            onClick={onClose}
            disabled={isCreating}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: isCreating ? 'not-allowed' : 'pointer',
              padding: 4,
              color: '#666',
            }}
          >
            ×
          </button>
        </div>

        {createError && (
          <div
            style={{
              padding: 12,
              backgroundColor: '#fee',
              color: '#e74c3c',
              fontSize: 12,
              borderRadius: 4,
              marginBottom: 16,
            }}
          >
            {createError}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Name <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              style={{
                ...inputStyle,
                borderColor: formErrors.name ? '#e74c3c' : '#ddd',
              }}
              disabled={isCreating}
              autoFocus
            />
            {formErrors.name && <div style={errorStyle}>{formErrors.name}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Product Code <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.productCode}
              onChange={(e) => handleChange('productCode', e.target.value)}
              style={{
                ...inputStyle,
                borderColor: formErrors.productCode ? '#e74c3c' : '#ddd',
              }}
              disabled={isCreating}
              placeholder="e.g., WP-001"
            />
            {formErrors.productCode && (
              <div style={errorStyle}>{formErrors.productCode}</div>
            )}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              style={{
                ...inputStyle,
                minHeight: 60,
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              disabled={isCreating}
              placeholder="Optional description"
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              style={{
                ...inputStyle,
                cursor: 'pointer',
              }}
              disabled={isCreating}
            >
              <option value="Design">Design</option>
              <option value="Prototype">Prototype</option>
              <option value="Production">Production</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              style={{
                ...inputStyle,
                borderColor: formErrors.price ? '#e74c3c' : '#ddd',
              }}
              disabled={isCreating}
              placeholder="0.00"
            />
            {formErrors.price && <div style={errorStyle}>{formErrors.price}</div>}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isCreating}
              style={{
                padding: '8px 16px',
                fontSize: 12,
                border: '1px solid #ddd',
                borderRadius: 4,
                backgroundColor: '#fff',
                cursor: isCreating ? 'not-allowed' : 'pointer',
                color: '#666',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              style={{
                padding: '8px 16px',
                fontSize: 12,
                border: 'none',
                borderRadius: 4,
                backgroundColor: isCreating ? '#93c5fd' : '#3b82f6',
                color: '#fff',
                cursor: isCreating ? 'not-allowed' : 'pointer',
                fontWeight: 500,
              }}
            >
              {isCreating ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
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
  product,
  formData,
  formErrors,
  updateError,
  isUpdating,
  onSubmit,
  onChange,
  onClose,
  compactMode,
}: EditProductDialogProps) {
  const handleChange = (field: keyof ProductFormData, value: string) => {
    onChange({ ...formData, [field]: value });
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    fontSize: 12,
    border: '1px solid #ddd',
    borderRadius: 4,
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 11,
    fontWeight: 600,
    marginBottom: 4,
    color: '#333',
  };

  const errorStyle = {
    fontSize: 10,
    color: '#e74c3c',
    marginTop: 4,
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isUpdating) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 24,
          width: '90%',
          maxWidth: 480,
          maxHeight: '90vh',
          overflow: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>
            Edit Product
          </h2>
          <button
            onClick={onClose}
            disabled={isUpdating}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 20,
              cursor: isUpdating ? 'not-allowed' : 'pointer',
              padding: 4,
              color: '#666',
            }}
          >
            ×
          </button>
        </div>

        {updateError && (
          <div
            style={{
              padding: 12,
              backgroundColor: '#fee',
              color: '#e74c3c',
              fontSize: 12,
              borderRadius: 4,
              marginBottom: 16,
            }}
          >
            {updateError}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Name <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              style={{
                ...inputStyle,
                borderColor: formErrors.name ? '#e74c3c' : '#ddd',
              }}
              disabled={isUpdating}
              autoFocus
            />
            {formErrors.name && <div style={errorStyle}>{formErrors.name}</div>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>
              Product Code <span style={{ color: '#e74c3c' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.productCode}
              onChange={(e) => handleChange('productCode', e.target.value)}
              style={{
                ...inputStyle,
                borderColor: formErrors.productCode ? '#e74c3c' : '#ddd',
                backgroundColor: '#f5f5f5',
              }}
              disabled={true}
              title="Product code cannot be changed"
            />
            {formErrors.productCode && (
              <div style={errorStyle}>{formErrors.productCode}</div>
            )}
            <div style={{ fontSize: 10, color: '#999', marginTop: 4 }}>
              Product code cannot be changed after creation
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              style={{
                ...inputStyle,
                minHeight: 60,
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
              disabled={isUpdating}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Status</label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              style={{
                ...inputStyle,
                cursor: 'pointer',
              }}
              disabled={isUpdating}
            >
              <option value="Design">Design</option>
              <option value="Prototype">Prototype</option>
              <option value="Production">Production</option>
              <option value="Discontinued">Discontinued</option>
            </select>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Price</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              style={{
                ...inputStyle,
                borderColor: formErrors.price ? '#e74c3c' : '#ddd',
              }}
              disabled={isUpdating}
            />
            {formErrors.price && <div style={errorStyle}>{formErrors.price}</div>}
          </div>

          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'flex-end',
            }}
          >
            <button
              type="button"
              onClick={onClose}
              disabled={isUpdating}
              style={{
                padding: '8px 16px',
                fontSize: 12,
                border: '1px solid #ddd',
                borderRadius: 4,
                backgroundColor: '#fff',
                cursor: isUpdating ? 'not-allowed' : 'pointer',
                color: '#666',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              style={{
                padding: '8px 16px',
                fontSize: 12,
                border: 'none',
                borderRadius: 4,
                backgroundColor: isUpdating ? '#93c5fd' : '#3b82f6',
                color: '#fff',
                cursor: isUpdating ? 'not-allowed' : 'pointer',
                fontWeight: 500,
              }}
            >
              {isUpdating ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
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
  compactMode,
}: DeleteConfirmDialogProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) {
          onClose();
        }
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 24,
          width: '90%',
          maxWidth: 400,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
          Delete Product
        </h2>

        <p style={{ fontSize: 13, color: '#666', marginBottom: 20 }}>
          Are you sure you want to delete <strong>{product.name}</strong>
          {product.settings.productCode && (
            <span> ({product.settings.productCode})</span>
          )}
          ? This action cannot be undone.
        </p>

        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={onClose}
            disabled={isDeleting}
            style={{
              padding: '8px 16px',
              fontSize: 12,
              border: '1px solid #ddd',
              borderRadius: 4,
              backgroundColor: '#fff',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              color: '#666',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              padding: '8px 16px',
              fontSize: 12,
              border: 'none',
              borderRadius: 4,
              backgroundColor: isDeleting ? '#f8a5a5' : '#e74c3c',
              color: '#fff',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, compact }: { status?: string; compact?: boolean }) {
  const colors: Record<string, string> = {
    Design: '#3b82f6',
    Prototype: '#f59e0b',
    Production: '#10b981',
    Discontinued: '#6b7280',
  };

  const color = colors[status || ''] || '#6b7280';
  const fontSize = compact ? 10 : 11;
  const padding = compact ? '1px 6px' : '2px 8px';

  return (
    <span
      style={{
        display: 'inline-block',
        padding,
        borderRadius: 4,
        fontSize,
        fontWeight: 500,
        backgroundColor: `${color}20`,
        color,
      }}
    >
      {status || 'Unknown'}
    </span>
  );
}
