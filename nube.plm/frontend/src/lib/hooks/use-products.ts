/**
 * Hook for product CRUD operations
 */

import { useState, useEffect, useCallback } from 'react';
import { Product, ProductFormData } from '../../types';
import { PLMClient, PLMClientConfig, formDataToProductInput, formDataToUpdateInput } from '../api/plm-client';

export interface UseProductsConfig extends PLMClientConfig {
  plmServiceId: string | null;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  createProduct: (formData: ProductFormData) => Promise<void>;
  updateProduct: (productId: string, formData: ProductFormData) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useProducts(config: UseProductsConfig): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!config.orgId || !config.deviceId) {
      setLoading(false);
      return;
    }

    try {
      const client = new PLMClient(config);
      const products = await client.queryProducts();
      setProducts(products);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('[useProducts] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [config.orgId, config.deviceId, config.baseUrl, config.token]);

  const createProduct = useCallback(
    async (formData: ProductFormData) => {
      if (!config.plmServiceId) {
        throw new Error('PLM system not initialized');
      }

      const client = new PLMClient(config);
      const input = formDataToProductInput(formData, config.plmServiceId);
      await client.createProduct(input);
      await fetchProducts();
    },
    [config.plmServiceId, config.orgId, config.deviceId, config.baseUrl, config.token, fetchProducts]
  );

  const updateProduct = useCallback(
    async (productId: string, formData: ProductFormData) => {
      const client = new PLMClient(config);
      const input = formDataToUpdateInput(formData);
      await client.updateProduct(productId, input);
      await fetchProducts();
    },
    [config.orgId, config.deviceId, config.baseUrl, config.token, fetchProducts]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      const client = new PLMClient(config);
      await client.deleteProduct(productId);
      await fetchProducts();
    },
    [config.orgId, config.deviceId, config.baseUrl, config.token, fetchProducts]
  );

  // Initial fetch
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Auto-refresh
  useEffect(() => {
    if (!config.autoRefresh || !config.refreshInterval) return;

    const intervalId = setInterval(fetchProducts, config.refreshInterval);
    return () => clearInterval(intervalId);
  }, [config.autoRefresh, config.refreshInterval, fetchProducts]);

  return {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  };
}
