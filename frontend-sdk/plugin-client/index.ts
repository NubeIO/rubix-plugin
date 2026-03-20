/**
 * Plugin Client - Reusable RAS client wrapper for all plugins
 *
 * This wrapper provides a simple, type-safe API for plugin widgets to
 * interact with the Rubix core API without having to manage authentication,
 * URL construction, or error handling manually.
 *
 * @example
 * ```tsx
 * import { createPluginClient } from '@rubix/sdk/plugin-client';
 *
 * function MyWidget({ orgId, deviceId, baseUrl, token }) {
 *   const client = createPluginClient({ orgId, deviceId, baseUrl, token });
 *
 *   // Query nodes
 *   const products = await client.queryNodes({ filter: 'type is "plm.product"' });
 *
 *   // Create node
 *   const newProduct = await client.createNode({
 *     type: 'plm.product',
 *     name: 'Widget Pro',
 *     settings: { productCode: 'WGT-001', price: 99.99 }
 *   });
 *
 *   // Update node
 *   await client.updateNode(nodeId, {
 *     name: 'Widget Pro v2',
 *     settings: { price: 149.99 }
 *   });
 *
 *   // Delete node
 *   await client.deleteNode(nodeId);
 * }
 * ```
 */

import { RASClient, fetchAdapter } from '../ras/client';
import type { Node } from '../ras/types';

export interface PluginClientConfig {
  orgId: string;
  deviceId: string;
  baseUrl?: string;
  token?: string;
}

export interface QueryNodesOptions {
  filter?: string;
  limit?: number;
  offset?: number;
  ports?: string[];
  runtime?: boolean;
}

export interface CreateNodeInput {
  type: string;
  name: string;
  parentId?: string;
  settings?: Record<string, unknown>;
  data?: Record<string, unknown>;
  ui?: Record<string, unknown>;
  position?: { x: number; y: number };
}

export interface UpdateNodeInput {
  name?: string;
  parentId?: string;
  settings?: Record<string, unknown>;
  data?: Record<string, unknown>;
  ui?: Record<string, unknown>;
  position?: { x: number; y: number };
}

export class PluginClientError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'PluginClientError';
  }
}

export class PluginClient {
  private client: RASClient;
  private config: Required<PluginClientConfig>;

  constructor(config: PluginClientConfig) {
    this.config = {
      orgId: config.orgId,
      deviceId: config.deviceId,
      baseUrl: config.baseUrl || '/api/v1',
      token: config.token || '',
    };

    // Create RAS client with auth interceptor
    const base = fetchAdapter();
    this.client = new RASClient(this.config.baseUrl, async (req) => {
      if (this.config.token) {
        req.headers = { ...req.headers, Authorization: `Bearer ${this.config.token}` };
      }
      return base(req);
    });
  }

  /**
   * Query nodes using Haystack filter syntax
   *
   * @example
   * ```ts
   * // Get all products
   * const products = await client.queryNodes({
   *   filter: 'type is "plm.product"'
   * });
   *
   * // Get products with pagination
   * const page1 = await client.queryNodes({
   *   filter: 'type is "plm.product"',
   *   limit: 10,
   *   offset: 0
   * });
   * ```
   */
  async queryNodes(options: QueryNodesOptions = {}): Promise<Node[]> {
    try {
      const result = await this.client.query.create({
        orgId: this.config.orgId,
        deviceId: this.config.deviceId,
        body: {
          filter: options.filter,
          limit: options.limit,
          offset: options.offset,
          ports: options.ports,
          runtime: options.runtime,
        },
      });
      return (result?.data || []) as Node[];
    } catch (err: any) {
      throw new PluginClientError(
        err?.details?.message || err?.message || 'Failed to query nodes',
        err?.status,
        err?.details
      );
    }
  }

  /**
   * Get a single node by ID
   *
   * @example
   * ```ts
   * const product = await client.getNode('node_abc123');
   * console.log(product.name, product.settings);
   * ```
   */
  async getNode(nodeId: string): Promise<Node> {
    try {
      const result = await this.client.nodes.get({
        orgId: this.config.orgId,
        deviceId: this.config.deviceId,
        nodeId,
      });
      return result as Node;
    } catch (err: any) {
      throw new PluginClientError(
        err?.details?.message || err?.message || 'Failed to get node',
        err?.status,
        err?.details
      );
    }
  }

  /**
   * Create a new node
   *
   * @example
   * ```ts
   * const product = await client.createNode({
   *   type: 'plm.product',
   *   name: 'Widget Pro',
   *   settings: {
   *     productCode: 'WGT-001',
   *     description: 'Premium widget',
   *     status: 'Production',
   *     price: 99.99
   *   }
   * });
   * ```
   */
  async createNode(input: CreateNodeInput): Promise<Node> {
    try {
      const result = await this.client.nodes.create({
        orgId: this.config.orgId,
        deviceId: this.config.deviceId,
        body: {
          type: input.type,
          name: input.name,
          parentId: input.parentId,
          settings: input.settings,
          data: input.data,
          ui: input.ui,
          position: input.position,
        },
      });
      return result as Node;
    } catch (err: any) {
      throw new PluginClientError(
        err?.details?.message || err?.message || 'Failed to create node',
        err?.status,
        err?.details
      );
    }
  }

  /**
   * Update an existing node
   *
   * @example
   * ```ts
   * await client.updateNode('node_abc123', {
   *   name: 'Widget Pro v2',
   *   settings: { price: 149.99 }
   * });
   * ```
   */
  async updateNode(nodeId: string, input: UpdateNodeInput): Promise<Node> {
    try {
      const result = await this.client.nodes.update({
        orgId: this.config.orgId,
        deviceId: this.config.deviceId,
        nodeId,
        body: {
          name: input.name,
          parentId: input.parentId,
          settings: input.settings,
          data: input.data,
          ui: input.ui,
          position: input.position,
        },
      });
      return result as Node;
    } catch (err: any) {
      throw new PluginClientError(
        err?.details?.message || err?.message || 'Failed to update node',
        err?.status,
        err?.details
      );
    }
  }

  /**
   * Delete a node
   *
   * @example
   * ```ts
   * await client.deleteNode('node_abc123');
   * ```
   */
  async deleteNode(nodeId: string): Promise<void> {
    try {
      await this.client.nodes.delete({
        orgId: this.config.orgId,
        deviceId: this.config.deviceId,
        nodeId,
      });
    } catch (err: any) {
      throw new PluginClientError(
        err?.details?.message || err?.message || 'Failed to delete node',
        err?.status,
        err?.details
      );
    }
  }

  /**
   * List all nodes (with optional filtering via query params)
   *
   * @example
   * ```ts
   * const allNodes = await client.listNodes();
   * ```
   */
  async listNodes(): Promise<Node[]> {
    try {
      const result = await this.client.nodes.list({
        orgId: this.config.orgId,
        deviceId: this.config.deviceId,
      });
      return (result?.data || []) as Node[];
    } catch (err: any) {
      throw new PluginClientError(
        err?.details?.message || err?.message || 'Failed to list nodes',
        err?.status,
        err?.details
      );
    }
  }

  /**
   * Get the underlying RAS client for advanced usage
   *
   * @example
   * ```ts
   * const client = pluginClient.getRASClient();
   * await client.edges.create({ ... });
   * ```
   */
  getRASClient(): RASClient {
    return this.client;
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<Required<PluginClientConfig>> {
    return { ...this.config };
  }
}

/**
 * Factory function to create a plugin client
 *
 * @example
 * ```tsx
 * function MyWidget({ orgId, deviceId, baseUrl, token }) {
 *   const client = createPluginClient({ orgId, deviceId, baseUrl, token });
 *   // ... use client
 * }
 * ```
 */
export function createPluginClient(config: PluginClientConfig): PluginClient {
  return new PluginClient(config);
}

/**
 * React hook for using the plugin client
 *
 * @example
 * ```tsx
 * function MyWidget({ orgId, deviceId, baseUrl, token }) {
 *   const client = usePluginClient({ orgId, deviceId, baseUrl, token });
 *
 *   useEffect(() => {
 *     client.queryNodes({ filter: 'type is "plm.product"' })
 *       .then(setProducts)
 *       .catch(setError);
 *   }, []);
 * }
 * ```
 */
export function usePluginClient(config: PluginClientConfig): PluginClient {
  // Simple memoization - in real React, you'd use useMemo
  // For now, just create a new instance each time
  // Plugins can optimize with useMemo if needed
  return new PluginClient(config);
}
