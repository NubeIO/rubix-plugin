/**
 * Product form fields component
 */

// @ts-ignore - SDK types are resolved at build time
import { Input, Label } from '@rubix/sdk';
import { ProductFormData, ProductFormErrors, PRODUCT_STATUSES } from '../../types';

interface ProductFormFieldsProps {
  formData: ProductFormData;
  formErrors: ProductFormErrors;
  disabled?: boolean;
  isEditing?: boolean;
  onChange: (field: keyof ProductFormData, value: string) => void;
}

export function ProductFormFields({
  formData,
  formErrors,
  disabled = false,
  isEditing = false,
  onChange,
}: ProductFormFieldsProps) {
  return (
    <div className="space-y-4">
      {/* Name */}
      <div>
        <Label>
          Name <span className="text-[var(--rubix-destructive)]">*</span>
        </Label>
        <Input
          type="text"
          value={formData.name}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('name', e.target.value)}
          className={formErrors.name ? 'border-[var(--rubix-destructive)]' : ''}
          disabled={disabled}
          autoFocus
        />
        {formErrors.name && (
          <div className="text-xs text-[var(--rubix-destructive)] mt-1">{formErrors.name}</div>
        )}
      </div>

      {/* Product Code */}
      <div>
        <Label>
          Product Code <span className="text-[var(--rubix-destructive)]">*</span>
        </Label>
        <Input
          type="text"
          value={formData.productCode}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('productCode', e.target.value)}
          className={`${formErrors.productCode ? 'border-[var(--rubix-destructive)]' : ''} ${isEditing ? 'bg-[var(--rubix-muted)]' : ''}`}
          disabled={disabled || isEditing}
          placeholder={isEditing ? undefined : 'e.g., WP-001'}
          title={isEditing ? 'Product code cannot be changed' : undefined}
        />
        {formErrors.productCode && (
          <div className="text-xs text-[var(--rubix-destructive)] mt-1">{formErrors.productCode}</div>
        )}
        {isEditing && (
          <div className="text-xs text-[var(--rubix-muted-foreground)] mt-1">
            Product code cannot be changed after creation
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <Label>Description</Label>
        <textarea
          value={formData.description}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange('description', e.target.value)}
          className="flex min-h-[60px] w-full rounded-[var(--rubix-radius-md)] border border-[var(--rubix-input)] bg-[var(--rubix-background)] px-3 py-2 text-sm placeholder:text-[var(--rubix-muted-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rubix-ring)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
          placeholder={isEditing ? undefined : 'Optional description'}
        />
      </div>

      {/* Status */}
      <div>
        <Label>Status</Label>
        <select
          value={formData.status}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange('status', e.target.value)}
          className="flex h-10 w-full rounded-[var(--rubix-radius-md)] border border-[var(--rubix-input)] bg-[var(--rubix-background)] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--rubix-ring)] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={disabled}
        >
          {PRODUCT_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Price */}
      <div>
        <Label>Price</Label>
        <Input
          type="number"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('price', e.target.value)}
          className={formErrors.price ? 'border-[var(--rubix-destructive)]' : ''}
          disabled={disabled}
          placeholder="0.00"
        />
        {formErrors.price && (
          <div className="text-xs text-[var(--rubix-destructive)] mt-1">{formErrors.price}</div>
        )}
      </div>
    </div>
  );
}
