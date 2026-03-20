/**
 * Product API methods
 */

import { createPluginClient } from '@rubix/sdk/plugin-client';
import { Product, ProductFormData } from './types';

export interface PLMClientConfig {
  orgId: string;
  deviceId: string;
  baseUrl?: string;
  token?: string;
}

export interface CreateProductInput {
  name: string;
  parentId: string;
  settings: {
    productCode: string;
    description?: string;
    status: string;
    price?: number;
  };
}

export interface UpdateProductInput {
  name: string;
  settings: {
    productCode: string;
    description?: string;
    status: string;
    price?: number;
  };
}

export class ProductsAPI {
  private client: ReturnType<typeof createPluginClient>;

  constructor(config: PLMClientConfig) {
    this.client = createPluginClient(config);
  }

  async queryProducts(): Promise<Product[]> {
    const filter = 'type is "plm.product"';
    const nodes = await this.client.queryNodes({ filter });
    return nodes as Product[];
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const node = await this.client.createNode({
      type: 'plm.product',
      name: input.name,
      parentId: input.parentId,
      settings: input.settings,
    });
    return node as Product;
  }

  async updateProduct(productId: string, input: UpdateProductInput): Promise<Product> {
    const node = await this.client.updateNode(productId, {
      name: input.name,
      settings: input.settings,
    });
    return node as Product;
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.client.deleteNode(productId);
  }
}

export function formDataToProductInput(
  formData: ProductFormData,
  parentId: string
): CreateProductInput {
  return {
    name: formData.name,
    parentId,
    settings: {
      productCode: formData.productCode,
      description: formData.description || undefined,
      status: formData.status,
      price: formData.price ? parseFloat(formData.price) : undefined,
    },
  };
}

export function formDataToUpdateInput(formData: ProductFormData): UpdateProductInput {
  return {
    name: formData.name,
    settings: {
      productCode: formData.productCode,
      description: formData.description || undefined,
      status: formData.status,
      price: formData.price ? parseFloat(formData.price) : undefined,
    },
  };
}
