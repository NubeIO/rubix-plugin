/**
 * PLM-specific API client
 */

import { createPluginClient } from '@rubix/sdk/plugin-client';
import { Product, ProductFormData } from '../../types';
import { PLM_NODE_TYPES } from '../constants';

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

export class PLMClient {
  private client: ReturnType<typeof createPluginClient>;

  constructor(config: PLMClientConfig) {
    this.client = createPluginClient(config);
  }

  async queryProducts(): Promise<Product[]> {
    const filter = `type is "${PLM_NODE_TYPES.PRODUCT}"`;
    const nodes = await this.client.queryNodes({ filter });
    return nodes as Product[];
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const node = await this.client.createNode({
      type: PLM_NODE_TYPES.PRODUCT,
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

  async getPLMService(): Promise<{ id: string } | null> {
    const filter = `type is "${PLM_NODE_TYPES.SERVICE}"`;
    const nodes = await this.client.queryNodes({ filter });
    return nodes.length > 0 ? { id: nodes[0].id } : null;
  }

  async createPLMService(): Promise<{ id: string }> {
    const node = await this.client.createNode({
      type: PLM_NODE_TYPES.SERVICE,
      name: 'PLM System',
      settings: {
        description: 'Product Lifecycle Management system root',
      },
    });
    return { id: node.id };
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
