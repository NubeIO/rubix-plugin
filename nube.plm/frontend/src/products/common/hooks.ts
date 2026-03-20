/**
 * Product-specific hooks
 */

import { useState, useEffect, useCallback } from 'react';
import { Product, ProductFormData } from './types';
import { ProductsAPI, PLMClientConfig, formDataToProductInput, formDataToUpdateInput } from './api';
import { usePLMHierarchy } from '../../shared/hooks/use-plm-hierarchy';

export interface UseProductsConfig extends PLMClientConfig {
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
  productsCollectionId: string | null;
  hierarchyLoading: boolean;
  hierarchyError: string | null;
}

export function useProducts(config: UseProductsConfig): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get PLM hierarchy (products collection ID)
  const { collections, loading: hierarchyLoading, error: hierarchyError } = usePLMHierarchy(
    config.orgId,
    config.deviceId,
    config.baseUrl,
    config.token
  );

  const fetchProducts = useCallback(async () => {
    if (!config.orgId || !config.deviceId) {
      setLoading(false);
      return;
    }

    try {
      const api = new ProductsAPI(config);
      const products = await api.queryProducts();
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
      if (!collections.products) {
        throw new Error('Products collection not found - restart plugin');
      }

      const api = new ProductsAPI(config);
      const input = formDataToProductInput(formData, collections.products);
      await api.createProduct(input);
      await fetchProducts();
    },
    [collections.products, config.orgId, config.deviceId, config.baseUrl, config.token, fetchProducts]
  );

  const updateProduct = useCallback(
    async (productId: string, formData: ProductFormData) => {
      const api = new ProductsAPI(config);
      const input = formDataToUpdateInput(formData);
      await api.updateProduct(productId, input);
      await fetchProducts();
    },
    [config.orgId, config.deviceId, config.baseUrl, config.token, fetchProducts]
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      const api = new ProductsAPI(config);
      await api.deleteProduct(productId);
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
    productsCollectionId: collections.products || null,
    hierarchyLoading,
    hierarchyError,
  };
}
