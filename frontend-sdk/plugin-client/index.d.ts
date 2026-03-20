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
import { RASClient } from '../ras/client';
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
    position?: {
        x: number;
        y: number;
    };
}
export interface UpdateNodeInput {
    name?: string;
    parentId?: string;
    settings?: Record<string, unknown>;
    data?: Record<string, unknown>;
    ui?: Record<string, unknown>;
    position?: {
        x: number;
        y: number;
    };
}
export declare class PluginClientError extends Error {
    status?: number | undefined;
    details?: unknown | undefined;
    constructor(message: string, status?: number | undefined, details?: unknown | undefined);
}
export declare class PluginClient {
    private client;
    private config;
    constructor(config: PluginClientConfig);
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
    queryNodes(options?: QueryNodesOptions): Promise<Node[]>;
    /**
     * Get a single node by ID
     *
     * @example
     * ```ts
     * const product = await client.getNode('node_abc123');
     * console.log(product.name, product.settings);
     * ```
     */
    getNode(nodeId: string): Promise<Node>;
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
    createNode(input: CreateNodeInput): Promise<Node>;
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
    updateNode(nodeId: string, input: UpdateNodeInput): Promise<Node>;
    /**
     * Delete a node
     *
     * @example
     * ```ts
     * await client.deleteNode('node_abc123');
     * ```
     */
    deleteNode(nodeId: string): Promise<void>;
    /**
     * List all nodes (with optional filtering via query params)
     *
     * @example
     * ```ts
     * const allNodes = await client.listNodes();
     * ```
     */
    listNodes(): Promise<Node[]>;
    /**
     * Get the underlying RAS client for advanced usage
     *
     * @example
     * ```ts
     * const client = pluginClient.getRASClient();
     * await client.edges.create({ ... });
     * ```
     */
    getRASClient(): RASClient;
    /**
     * Get the current configuration
     */
    getConfig(): Readonly<Required<PluginClientConfig>>;
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
export declare function createPluginClient(config: PluginClientConfig): PluginClient;
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
export declare function usePluginClient(config: PluginClientConfig): PluginClient;
