import { useState, useEffect } from 'react';
import { createPluginClient } from '@rubix/sdk/plugin-client';

export interface PLMHierarchy {
  service?: string;
  products?: string;
  // TODO: Uncomment when other collections are enabled
  // productionRuns?: string;
  // serializedUnits?: string;
  // workItems?: string;
  // sites?: string;
}

export interface UsePLMHierarchyResult {
  collections: PLMHierarchy;
  loading: boolean;
  error: string | null;
}

export function usePLMHierarchy(
  orgId?: string,
  deviceId?: string,
  baseUrl?: string,
  token?: string
): UsePLMHierarchyResult {
  const [collections, setCollections] = useState<PLMHierarchy>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      if (!orgId || !deviceId) {
        setLoading(false);
        return;
      }

      try {
        const client = createPluginClient({ orgId, deviceId, baseUrl, token });

        // Query for service node
        const serviceNodes = await client.queryNodes({
          filter: 'type is "plm.service"',
        });

        if (serviceNodes.length === 0) {
          setError('PLM service not initialized - restart plugin');
          setLoading(false);
          return;
        }

        const serviceId = serviceNodes[0].id;

        // Query for collection nodes under service
        const collectionNodes = await client.queryNodes({
          filter: `parentRef is "${serviceId}"`,
        });

        // Build collection map
        const hierarchy: PLMHierarchy = { service: serviceId };
        for (const node of collectionNodes) {
          switch (node.type) {
            case 'plm.products':
              hierarchy.products = node.id;
              break;
            // TODO: Uncomment when other collections are enabled
            // case 'plm.production-runs':
            //   hierarchy.productionRuns = node.id;
            //   break;
            // case 'plm.serialized-units':
            //   hierarchy.serializedUnits = node.id;
            //   break;
            // case 'plm.work-items':
            //   hierarchy.workItems = node.id;
            //   break;
            // case 'plm.sites':
            //   hierarchy.sites = node.id;
            //   break;
          }
        }

        setCollections(hierarchy);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || 'Failed to load PLM hierarchy');
        setLoading(false);
      }
    };

    fetchCollections();
  }, [orgId, deviceId, baseUrl, token]);

  return { collections, loading, error };
}
