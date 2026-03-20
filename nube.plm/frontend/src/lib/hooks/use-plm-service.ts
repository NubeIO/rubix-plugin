/**
 * Hook to get or create PLM service root node
 */

import { useState, useEffect } from 'react';
import { PLMClient, PLMClientConfig } from '../api/plm-client';

export interface UsePLMServiceResult {
  plmServiceId: string | null;
  loading: boolean;
  error: string | null;
}

export function usePLMService(config: PLMClientConfig | null): UsePLMServiceResult {
  const [plmServiceId, setPlmServiceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config) {
      setLoading(false);
      return;
    }

    const initPLMService = async () => {
      try {
        const client = new PLMClient(config);

        // Try to get existing PLM service
        const existing = await client.getPLMService();

        if (existing) {
          setPlmServiceId(existing.id);
        } else {
          // Create new PLM service
          const created = await client.createPLMService();
          setPlmServiceId(created.id);
        }

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize PLM system');
        console.error('[usePLMService] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    initPLMService();
  }, [config?.orgId, config?.deviceId, config?.baseUrl, config?.token]);

  return { plmServiceId, loading, error };
}
