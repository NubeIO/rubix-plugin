/**
 * Hook to get or create PLM service root node
 * Shared across all PLM features
 */

import { useState, useEffect } from 'react';
import { createPluginClient } from '@rubix/sdk/plugin-client';

export interface PLMClientConfig {
  orgId: string;
  deviceId: string;
  baseUrl?: string;
  token?: string;
}

export interface UsePLMServiceResult {
  plmServiceId: string | null;
  loading: boolean;
  error: string | null;
}

const PLM_SERVICE_TYPE = 'plm.service';

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
        const client = createPluginClient(config);

        // Try to get existing PLM service
        const filter = `type is "${PLM_SERVICE_TYPE}"`;
        const nodes = await client.queryNodes({ filter });

        if (nodes.length > 0) {
          setPlmServiceId(nodes[0].id);
        } else {
          // Create new PLM service root node
          const created = await client.createNode({
            type: PLM_SERVICE_TYPE,
            name: 'PLM System',
            settings: {
              description: 'Product Lifecycle Management system root',
            },
          });
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
