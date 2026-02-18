// Auto-generated TypeScript types from RAS
// Do not edit manually

// deno-lint-ignore-file

export type AlarmState = 'normal' | 'active' | 'acknowledged' | 'silenced';
export type CommandDefinitionExecutionMode = 'sync' | 'async' | 'auto';
export type CommandDefinitionMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';
export type CommandDefinitionResponseType = 'object' | 'array';
export type CommandJobStatus = 'pending' | 'running' | 'success' | 'failed';
export type EdgeCreateType = 'default' | 'straight' | 'step' | 'smoothstep' | 'simplebezier';
export type EmailQueueStatus = 'pending' | 'sending' | 'sent' | 'failed';
export type FlowExecuteResponseStatus = 'success' | 'timeout' | 'error';
export type NatsInfoGlobalStatus = 'connected' | 'disconnected';
export type NatsInfoLocalStatus = 'connected' | 'disconnected';
export type NavPageReferenceContext = 'list' | 'detail' | 'management' | 'custom';
export type NavPageReferencePageDisplay = 'sidebar' | 'selection' | 'all';
export type NavPageReferenceSource = 'builtin' | 'page' | 'module';
export type PortMappingNetwork = 'local' | 'global';
export type PortValueInfoType = 'any' | 'string' | 'number' | 'boolean' | 'object' | 'array';
export type RootDeviceInfoStatus = 'online' | 'offline';
export type RuntimeV2StatusStatus = 'running' | 'stopped' | 'error' | 'starting' | 'stopping';
export type RxAISessionStatus = 'active' | 'completed' | 'error';
export type RxAISourceType = 'page' | 'url' | 'text' | 'node';
export type SignupRequestDeviceType = 'cloud' | 'edge';
export type SignupResponseDeviceType = 'cloud' | 'edge';
export type UpdateHistoryConfigRequestHistoryPolicy = 'cov' | 'cov_threshold' | 'interval' | 'interval_or_cov';

export interface AdminOrgCreate {
  /** Optional organization description */
  description?: string;
  /** Organization name */
  name: string;
  /** Unique organization identifier */
  orgId: string;
}

/**
 * An alarm instance
 */
export interface Alarm {
  /** Acknowledgement comment */
  ackComment?: string;
  /** Acknowledgement timestamp */
  acknowledgedAt?: string;
  /** User who acknowledged */
  acknowledgedBy?: string;
  /** Reference to alarm class */
  alarmClassId?: string;
  /** Type of alarm (limit, state, rate, etc.) */
  alarmType?: string;
  /** Display color (hex) */
  color?: string;
  createdAt?: string;
  /** Current value that triggered/cleared the alarm */
  currentValue?: unknown;
  /** Alarm description */
  description?: string;
  /** Unique alarm identifier */
  id?: string;
  /** Whether alarm is acknowledged */
  isAcknowledged?: boolean;
  /** Whether alarm is silenced */
  isSilenced?: boolean;
  /** Last clear timestamp */
  lastCleared?: string;
  /** Last trigger timestamp */
  lastTriggered?: string;
  /** Display name */
  name?: string;
  /** Organization ID */
  orgId?: string;
  /** Priority (1-100) */
  priority?: number;
  /** Alarm severity (Critical, Warning, Info) */
  severity?: string;
  /** Reason for silencing */
  silenceReason?: string;
  /** Silence timestamp */
  silencedAt?: string;
  /** User who silenced */
  silencedBy?: string;
  /** Silence expiration (null = indefinite) */
  silencedUntil?: string;
  /** Node that owns this alarm */
  sourceNodeId?: string;
  /** Current alarm state */
  state?: AlarmState;
  /** Total times triggered */
  triggerCount?: number;
  updatedAt?: string;
}

/**
 * Response containing list of alarms
 */
export interface AlarmListResponse {
  alarms?: Alarm[];
  /** Limit used in query */
  limit?: number;
  /** Offset used in query */
  offset?: number;
  /** Total number of alarms */
  total?: number;
}

/**
 * Information about a node that has a page attached to it
 */
export interface AttachedNodeInfo {
  /** Node ID */
  nodeId?: string;
  /** Node name */
  nodeName?: string;
  /** Node type */
  nodeType?: string;
  /** Reference ID */
  refId?: string;
}

/**
 * A single breadcrumb item in the navigation path
 */
export interface Breadcrumb {
  /** Icon for this breadcrumb */
  icon?: string;
  /** Display name (e.g., "Sync Manager", "Organization") */
  name: string;
  /** Node ID for linking */
  nodeId?: string;
  /** Node type for frontend routing */
  nodeType?: string;
  /** Full URL path to this node */
  url: string;
}

/**
 * Request to execute multiple commands
 */
export interface BulkCommandRequest {
  /** Commands to execute */
  commands: { name: string; parameters: Record<string, unknown> }[];
}

/**
 * Response from bulk command execution
 */
export interface BulkCommandResponse {
  /** Job IDs for each command (in order) */
  jobIds?: string[];
}

/**
 * Bulk create multiple nodes and edges in one transaction
 */
export interface BulkCreateRequest {
  /** Array of edges to create (after nodes) */
  edges?: EdgeCreate[];
  /** Array of nodes to create */
  nodes?: NodeCreate[];
}

/**
 * Bulk delete multiple edges
 */
export interface BulkDeleteEdgesRequest {
  /** Array of edge IDs to delete */
  edgeIds: string[];
}

/**
 * Bulk delete multiple nodes and edges
 */
export interface BulkDeleteRequest {
  /** Array of edge IDs to delete */
  edgeIds?: string[];
  /** Delete child nodes with parentRef pointing to deleted nodes */
  includeChildren?: boolean;
  /** Array of node IDs to delete */
  nodeIds?: string[];
}

/**
 * Bulk update multiple edges
 */
export interface BulkUpdateEdgesRequest {
  /** Array of edge updates */
  updates: { animated?: boolean; id: string; label?: string; sourceHandle?: string; targetHandle?: string }[];
}

/**
 * Bulk update multiple nodes (settings, position, data, tags)
 */
export interface BulkUpdateNodesRequest {
  /** Array of node updates */
  updates: { data?: Record<string, unknown>; id: string; position?: { x?: number; y?: number }; settings?: Record<string, unknown>; tags?: Record<string, unknown> }[];
}

/**
 * Command definition with metadata and JSON schema
 */
export interface CommandDefinition {
  /** Human-readable description */
  description?: string;
  /** Execution mode - sync (immediate), async (job), auto (decide based on duration) */
  executionMode?: CommandDefinitionExecutionMode;
  /** HTTP method semantics (default POST) */
  method?: CommandDefinitionMethod;
  /** Command name (e.g., "discover", "ping", "addDevice") */
  name?: string;
  /** Required provisions/permissions (e.g., ["supervisor"]) */
  provisions?: string[];
  /** JSON schema for command OUTPUT/response */
  responseSchema?: Record<string, unknown>;
  /** Type of response - object or array */
  responseType?: CommandDefinitionResponseType;
  /** JSON schema for command INPUT parameters */
  schema?: Record<string, unknown>;
}

/**
 * Async command execution job
 */
export interface CommandJob {
  /** Command being executed */
  commandName?: string;
  /** When execution finished */
  completedAt?: string;
  /** When job was created */
  createdAt?: string;
  /** User who initiated command */
  createdBy?: string;
  /** Device ID */
  deviceId?: string;
  /** Error message if failed */
  error?: string;
  /** Job ID (UUID) */
  id?: string;
  /** Node executing the command */
  nodeId?: string;
  /** Organization ID */
  orgId?: string;
  /** Command input parameters */
  parameters?: Record<string, unknown>;
  /** Command execution result */
  result?: Record<string, unknown>;
  /** When execution started */
  startedAt?: string;
  /** Job status */
  status?: CommandJobStatus;
}

export interface CreateTeamRequest {
  description?: string;
  name: string;
}

export interface DeviceBlacklist {
  /** When device was blacklisted */
  blacklistedAt?: string;
  /** User ID who blacklisted the device */
  blacklistedBy?: string;
  createdAt?: string;
  /** Detailed explanation */
  description?: string;
  /** Device business ID (if was provisioned) */
  deviceId?: string;
  /** Device node ID (if was provisioned) */
  deviceNodeId?: string;
  /** Hardware model */
  hardwareModel?: string;
  /** Blacklist entry ID */
  id?: string;
  /** Whether blacklist entry is active */
  isActive?: boolean;
  /** Organization ID */
  orgId?: string;
  /** Blacklist reason (e.g., security_threat, policy_violation) */
  reason?: string;
  /** Reason for removal from blacklist */
  removalReason?: string;
  /** When device was removed from blacklist (if applicable) */
  removedAt?: string;
  /** User ID who removed from blacklist */
  removedBy?: string;
  /** Device role */
  role?: string;
  /** Device serial number */
  serialNumber?: string;
  updatedAt?: string;
}

export interface DeviceCreate {
  /** Device name (e.g., "AHU-1-Sydney-KFC") */
  name: string;
  /** Haystack tags (device:true auto-added, equip, ahu, siteRef, etc.) */
  tags?: Record<string, unknown>;
}

/**
 * Comprehensive device information including root and child devices
 */
export interface DeviceInfo {
  /** List of child devices under this organization */
  childDevices: { id?: string; name?: string; networkType?: string; role?: string; status?: 'online' | 'offline'; type?: string }[];
  /** Organization ID */
  orgId: string;
  /** Root/supervisor device information */
  rootDevice: { id: string; name: string; networkType?: string; role: string; status: 'online' | 'offline'; type: string };
  /** Device statistics */
  stats: { offlineDevices: number; onlineDevices: number; totalDevices: number };
  /** ISO 8601 timestamp */
  timestamp: string;
}

export interface DeviceUpdate {
  name?: string;
  tags?: Record<string, unknown>;
}

export interface DisableOrgRequest {
  /** Additional metadata about the disable action */
  metadata?: Record<string, unknown>;
  /** Reason for disabling organization (e.g., "non-payment", "policy violation", "suspension") */
  reason: string;
}

/**
 * React Flow compatible edge structure
 */
export interface EdgeCreate {
  animated?: boolean;
  label?: string;
  /** Source node ID (React Flow) */
  source: string;
  /** Source handle ID (React Flow) */
  sourceHandle?: string;
  /** Additional Haystack tags (edge:true, flowRef auto-added) */
  tags?: Record<string, unknown>;
  /** Target node ID (React Flow) */
  target: string;
  /** Target handle ID (React Flow) */
  targetHandle?: string;
  /** React Flow edge type */
  type?: EdgeCreateType;
}

export interface EdgeUpdate {
  sourceHandle?: string;
  targetHandle?: string;
}

export interface EmailQueue {
  attempts?: number;
  cc?: string;
  createdAt?: string;
  error?: string;
  id?: string;
  maxRetries?: number;
  message?: string;
  nodeId?: string;
  orgId?: string;
  status?: EmailQueueStatus;
  subject?: string;
  to?: string;
  updatedAt?: string;
}

export interface EnableOrgRequest {
  /** Additional metadata about the enable action */
  metadata?: Record<string, unknown>;
  /** Optional note about re-enabling the organization */
  note?: string;
}

export interface EnumCreateRequest {
  /** Optional description */
  description?: string;
  /** Enum ID in format "orgId.name" (e.g., "org1.equipmentStatus") */
  id: string;
  /** Human-readable name */
  name: string;
  /** List of possible states (at least one required) */
  states: EnumState[];
}

export interface EnumDef {
  /** Optional description */
  description?: string;
  /** Unique enum ID (e.g., "binary.onOff", "hvac.mode", "org1.customMode") */
  id: string;
  /** true for built-in enums, false for custom */
  isBuiltIn?: boolean;
  /** Human-readable name */
  name: string;
  /** Organization ID for custom enums */
  orgId?: string;
  /** List of possible states */
  states: EnumState[];
}

/**
 * Response containing all enums (built-in + custom for org)
 */
export interface EnumListResponse {
  /** Total number of enums */
  count?: number;
  /** List of enum definitions */
  enums?: EnumDef[];
}

export interface EnumState {
  /** Optional description of this state */
  description?: string;
  /** Machine-readable key (e.g., "off", "on", "auto") */
  key: string;
  /** Human-readable label (e.g., "Off", "On", "Auto") */
  label: string;
  /** Numeric value for this state (e.g., 0, 1, 2) */
  value: number;
}

export interface EnumUpdateRequest {
  /** Optional description */
  description?: string;
  /** Human-readable name */
  name?: string;
  /** List of possible states */
  states?: EnumState[];
}

export interface FlowCreate {
  description?: string;
  name: string;
}

/**
 * Request to execute a flow (V2 runtime)
 */
export interface FlowExecuteRequest {
  /** Connections between nodes */
  edges: { fromNode: string; fromPort: string; toNode: string; toPort: string }[];
  /** Optional initial trigger input */
  input?: { nodeId?: string; port?: string; value?: unknown };
  /** Nodes to execute */
  nodes: { id: string; name?: string; settings?: Record<string, unknown>; type: string }[];
  /** Execution timeout in seconds (default 30) */
  timeout?: number;
}

/**
 * Response from flow execution
 */
export interface FlowExecuteResponse {
  /** Execution duration */
  duration?: string;
  /** Number of edges loaded */
  edgesLoaded?: number;
  /** Any errors encountered */
  errors?: string[];
  /** Number of nodes loaded */
  nodesLoaded?: number;
  /** Execution status */
  status?: FlowExecuteResponseStatus;
  /** Any warnings */
  warnings?: string[];
}

export interface FlowUpdate {
  description?: string;
  name?: string;
}

/**
 * List of nodes with history-enabled ports
 */
export interface HistoryNodesResponse {
  count?: number;
  /** Array of node IDs with history-enabled ports */
  nodes?: unknown[];
}

/**
 * History configuration for a port
 */
export interface HistoryPortConfigResponse {
  historyEnabled?: boolean;
  historyInterval?: number;
  historyPolicy?: string;
  historyThreshold?: number;
  nodeId?: string;
  portId?: string;
}

/**
 * List of history-enabled ports
 */
export interface HistoryPortsResponse {
  count?: number;
  /** Array of port configurations */
  ports?: unknown[];
}

/**
 * History manager statistics
 */
export interface HistoryStatsResponse {
  bufferCapacity?: number;
  bufferSize?: number;
  enabled?: boolean;
  flushInterval?: string;
  lastFlushTime?: string;
  registeredPorts?: number;
  totalFlushed?: number;
  totalRecorded?: number;
}

export interface InviteUserRequest {
  email: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: Record<string, unknown>;
}

export interface MessageResponse {
  /** Optional additional data */
  data?: Record<string, unknown>;
  /** Success or informational message */
  message: string;
}

/**
 * NATS connection information
 */
export interface NatsInfo {
  /** Global NATS connection status */
  globalStatus: NatsInfoGlobalStatus;
  /** From config nats.globalURL */
  globalUrl: string;
  /** Local NATS connection status */
  localStatus: NatsInfoLocalStatus;
  /** From config nats.localURL */
  localUrl: string;
}

/**
 * A navigation item in the hierarchical sidebar tree (recursive structure). Includes Phase 1 enhanced metadata (isRemoteDevice, isExpandable, lazyLoadUrl, fullSidebarUrl, actions) for improved UI integration.
 */
export interface NavItemResponse {
  /** Phase 1: Context-specific quick actions available for this node */
  actions?: QuickAction[];
  /** Total number of children */
  childCount?: number;
  /** Device ID for NATS routing (for remote nodes) */
  deviceId?: string;
  /** Phase 1: URL for loading full sidebar view of this device */
  fullSidebarUrl?: string;
  /** Has unloaded children (for lazy loading) */
  hasMore?: boolean;
  /** Icon name for the navigation item */
  icon?: string;
  /** Phase 1: Indicates if this node has children that can be lazy-loaded */
  isExpandable?: boolean;
  /** Phase 1: Indicates if this device node is remote (not the current device) */
  isRemoteDevice?: boolean;
  /** Child navigation items (recursive) */
  items?: NavItemResponse[];
  /** Phase 1: URL for lazy-loading this node's children (UI doesn't need to construct URLs manually) */
  lazyLoadUrl?: string;
  /** Node ID for linking (null for views) */
  nodeId?: string;
  /** Node type for frontend routing */
  nodeType?: string;
  /** Sort order */
  order?: number;
  /** Primary/default page ID */
  pageId?: string;
  /** Multi-page support - map of pageId to page metadata (object format is required by frontend) */
  pages?: Record<string, NavPageReference>;
  /** Display title for the navigation item */
  title?: string;
  /** URL path for navigation */
  url?: string;
}

/**
 * Action button configuration
 */
export interface NavPageAction {
  /** Whether this action is enabled */
  enabled: boolean;
  /** API endpoint for action */
  endpoint?: string;
  /** Filterable fields (for filter actions) */
  fields?: string[];
  /** Export formats (for export actions) */
  formats?: string[];
  /** Button icon */
  icon?: string;
  /** Button label */
  label?: string;
  /** HTTP method for action */
  method?: string;
  /** Required permissions */
  permissions?: string[];
}

/**
 * Data fetching configuration for page
 */
export interface NavPageDataSource {
  /** API endpoint to fetch from */
  endpoint?: string;
  /** HTTP method (GET, POST, etc.) */
  method?: string;
  /** Query parameters */
  params?: Record<string, unknown>;
  /** Data source type (e.g., "api") */
  type?: string;
}

/**
 * Layout hints for rendering the page
 */
export interface NavPageLayout {
  /** Column definitions for table layout */
  columns?: { field?: string; format?: string; label?: string; sortable?: boolean; type?: string; width?: string }[];
  /** Whether to use full width */
  fullWidth?: boolean;
  /** Whether to show filters */
  showFilters?: boolean;
  /** Whether to show header */
  showHeader?: boolean;
  /** Whether to show search */
  showSearch?: boolean;
  /** Layout type (e.g., "table", "grid", "flex") */
  type?: string;
}

/**
 * Page reference with enhanced metadata for multi-page navigation support
 */
export interface NavPageReference {
  /** Available actions for this page */
  actions?: Record<string, NavPageAction>;
  /** Context hint for when to show this page */
  context?: NavPageReferenceContext;
  dataSource?: NavPageDataSource;
  /** Whether this is the default page */
  default?: boolean;
  /** Description of what this page does */
  description?: string;
  /** Whether this page is enabled/visible */
  enabled: boolean;
  /** Icon for the page tab */
  icon?: string;
  layout?: NavPageLayout;
  /** Module federation remote name (required if source=module) */
  module?: string;
  /** Display order in tabs (lower = first) */
  order?: number;
  /** Where to display this page: 'sidebar' (only in sidebar), 'selection' (only in header dropdown), 'all' (both places) */
  pageDisplay?: NavPageReferencePageDisplay;
  /** Unique page identifier */
  pageId: string;
  /** Props to pass to the page/module */
  props?: Record<string, unknown>;
  /** Conditional visibility rules */
  showWhen?: Record<string, unknown>;
  /** Page source: 'builtin' (core frontend), 'page' (standard page system), 'module' (module federation) */
  source: NavPageReferenceSource;
  /** Display title for the page tab */
  title?: string;
}

/**
 * Response containing hierarchical navigation tree for sidebar
 */
export interface NavTreeResponse {
  /** Navigation tree with breadcrumbs */
  data?: { breadcrumbs?: Breadcrumb[]; tree?: NavItemResponse[] };
  /** Metadata about the navigation tree */
  meta?: { deviceId?: string; orgId?: string; pageView?: string; timestamp?: string; userId?: string; userRole?: string };
}

export interface NetworkDevice {
  /** When device was added to network */
  addedAt?: string;
  /** Device ID */
  id?: string;
  /** Optional metadata about the device */
  metadata?: Record<string, unknown>;
  /** Device name */
  name?: string;
}

/**
 * Information about a rubix.network node and its devices
 */
export interface NetworkInfo {
  /** Creation timestamp */
  createdAt?: string;
  /** Devices under this network (rubix.rubix_device nodes) */
  devices: RubixDeviceInfo[];
  /** Network name */
  name: string;
  /** "local" or "global" from node.Data */
  networkType?: string;
  /** Node ID from DB */
  nodeId: string;
  /** "active", "inactive" from node.Data */
  status?: string;
  /** Always "rubix.network" */
  type: string;
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * A flow graph node with full details
 */
export interface Node {
  createdAt?: string;
  data?: Record<string, unknown>;
  id?: string;
  /** Parent node ID (extracted from parentRef) */
  parentId?: string;
  position?: { x?: number; y?: number };
  refs?: Record<string, string>;
  tags?: Record<string, unknown>;
  type?: string;
  updatedAt?: string;
}

/**
 * Flow graph node (timer, counter, sensor, etc.) - ONE file per node!
 */
export interface NodeCreate {
  /** Node-specific data (label, settings, etc.) */
  data?: Record<string, unknown>;
  /** Position on canvas (React Flow compatible) */
  position: { x: number; y: number };
  /** Typed node references (e.g., {"siteRef":"site-123", "equipRef":"equip-456"}) */
  refs?: Record<string, string>;
  /** Additional Haystack tags (node:true, orgRef auto-added) */
  tags?: Record<string, unknown>;
  /** Node type (e.g., "trigger.timer", "transform.counter", "sensor.temperature") */
  type: string;
}

/**
 * Versioned datastore entry for a node
 */
export interface NodeDataStoreItem {
  bucket?: string;
  createdAt?: string;
  data?: Record<string, unknown>;
  id?: number;
  index?: number;
  nodeId?: string;
  updatedAt?: string;
}

export interface NodeListResponse {
  count?: number;
  nodes?: Node[];
}

/**
 * Response containing all port values for a specific node
 */
export interface NodePortValuesResponse {
  /** Input port values (port handle -> value info) */
  inputs?: Record<string, PortValueInfo>;
  /** Node ID */
  nodeId?: string;
  /** Output port values (port handle -> value info) */
  outputs?: Record<string, PortValueInfo>;
}

/**
 * Response containing node settings schema and current values
 */
export interface NodeSettingsSchemaResponse {
  /** The node type identifier */
  nodeType?: string;
  /** JSON Schema for the node's settings */
  schema?: Record<string, unknown>;
  /** Current settings values for the node */
  settings?: Record<string, unknown>;
}

/**
 * Update node position, data, tags, or refs
 */
export interface NodeUpdate {
  data?: Record<string, unknown>;
  position?: { x?: number; y?: number };
  /** Update typed node references (e.g., {"siteRef":"site-123", "equipRef":"equip-456"}) */
  refs?: Record<string, string>;
  tags?: Record<string, unknown>;
}

/**
 * All port values for a single node
 */
export interface NodeValuesInfo {
  /** Input port values (port handle -> value info) */
  inputs?: Record<string, PortValueInfo>;
  /** Output port values (port handle -> value info) */
  outputs?: Record<string, PortValueInfo>;
}

export interface OrgCreate {
  /** Organization name (e.g., "Daikin", "Fujitsu") */
  name: string;
  /** Haystack-style tags (key-value pairs) */
  tags?: Record<string, unknown>;
}

/**
 * Comprehensive organization information
 */
export interface OrgInfo {
  /** Rubix networks and their discovered/provisioned devices */
  networks: NetworkInfo[];
  /** Organization ID */
  orgId: string;
  /** Organization name */
  orgName?: string;
  /** Root device information from config */
  rootDevice: RootDeviceInfo;
  /** Summary statistics */
  stats: OrgInfoStats;
  /** ISO 8601 timestamp */
  timestamp: string;
}

/**
 * Summary statistics
 */
export interface OrgInfoStats {
  /** Number of discovered devices */
  discoveredDevices: number;
  /** Number of offline devices */
  offlineDevices: number;
  /** Number of provisioned devices */
  provisionedDevices: number;
  /** Total number of devices */
  totalDevices: number;
  /** Total number of networks */
  totalNetworks: number;
}

export interface OrgStatusResponse {
  /** ISO timestamp when organization was disabled */
  disabledAt?: string;
  /** Reason if organization is disabled */
  disabledReason?: string;
  /** Whether organization is currently enabled */
  enabled: boolean;
  /** ISO timestamp when organization was (re)enabled */
  enabledAt?: string;
  /** Organization ID */
  orgId: string;
}

export interface OrgUpdate {
  name?: string;
  tags?: Record<string, unknown>;
}

/**
 * Complete structure of a page including templates, widgets, and attached nodes
 */
export interface PageStructure {
  /** Nodes that have this page attached via pageRef */
  attachedTo?: AttachedNodeInfo[];
  /** The page node itself */
  page?: PageStructureNode;
  /** Templates attached to this page */
  templates?: PageStructureNode[];
  /** Widgets directly attached to this page */
  widgets?: PageStructureNode[];
}

/**
 * Node in a page structure (page, template, or widget)
 */
export interface PageStructureNode {
  /** Node ID */
  nodeId?: string;
  /** Node name */
  nodeName?: string;
  /** Node type (e.g., "page", "template", "widget") */
  nodeType?: string;
  /** Display order (for templates and widgets) */
  order?: number;
  /** Node settings/configuration */
  settings?: Record<string, unknown>;
  /** Template slot/zone (for widgets) */
  slot?: string;
  /** Widgets attached to this template (for template nodes) */
  widgets?: PageStructureNode[];
}

/**
 * Response containing all available node types
 */
export interface PalletResponse {
  /** Total number of available node types */
  count?: number;
  /** List of all registered node types (e.g., ["trigger.timer", "transform.counter", "ui.widget"]) */
  nodeTypes?: string[];
}

export interface PortMapping {
  createdAt?: string;
  description?: string;
  deviceId?: string;
  enabled?: boolean;
  /** Fallback value (any type) */
  fallbackValue?: unknown;
  fallbackValueType?: string;
  /** Mapping ID */
  id?: string;
  name?: string;
  network?: PortMappingNetwork;
  nodeId?: string;
  orgId?: string;
  portHandle?: string;
  portId?: string;
  /** Number of active subscribers */
  subscriberCount?: number;
  subscriptions?: PortSubscription[];
  tags?: string[];
  /** Auto-generated NATS topic */
  topic?: string;
  updatedAt?: string;
}

export interface PortSubscription {
  createdAt?: string;
  /** Subscriber device ID */
  deviceId?: string;
  enabled?: boolean;
  /** Subscription ID */
  id?: string;
  /** Source mapping details (when preloaded) */
  mapping?: PortMapping;
  /** Source mapping ID */
  mappingId?: string;
  nodeId?: string;
  orgId?: string;
  portHandle?: string;
  portId?: string;
  sourceDeviceId?: string;
  sourceNodeId?: string;
  sourcePortId?: string;
  updatedAt?: string;
}

/**
 * Port value with metadata
 */
export interface PortValueInfo {
  /** When this value was last updated */
  timestamp?: string;
  /** Port data type */
  type?: PortValueInfoType;
  /** The actual port value (any type) */
  value?: unknown;
}

/**
 * Port with complete status (metadata, runtime value, override info, and history settings)
 */
export interface PortWithStatus {
  /** Port description */
  description?: string;
  /** Whether this port is disabled */
  disablePort?: boolean;
  /** Enum ID if this port uses an enum */
  enumId?: string;
  /** Port handle (e.g., "in", "out", "increment") */
  handle?: string;
  /** Whether history recording is enabled for this port */
  historyEnabled?: boolean;
  /** Interval in seconds for interval-based policies */
  historyInterval?: number;
  /** History recording policy (cov, cov_threshold, interval, interval_or_cov) */
  historyPolicy?: string;
  /** Threshold for cov_threshold policy */
  historyThreshold?: number;
  /** Port ID */
  id?: string;
  /** Whether this port has an override value set */
  isOverridden?: boolean;
  /** Port kind (input/output) */
  kind?: string;
  /** Value before override (any type) */
  lastValue?: unknown;
  /** Port display name */
  name?: string;
  /** Node ID this port belongs to */
  nodeId?: string;
  /** Override timeout duration */
  overrideTimeout?: string;
  /** Override value if set (any type) */
  overrideValue?: unknown;
  /** Type of the override value */
  overrideValueType?: string;
  /** Physical quantity (e.g., "temperature", "pressure") */
  quantity?: string;
  /** Whether this port is required */
  required?: boolean;
  /** Time remaining on override */
  timeRemaining?: string;
  /** Timestamp of current value */
  timestamp?: string;
  /** Port data type */
  type?: string;
  /** Unit of measurement (e.g., "degC", "kPa") */
  unit?: string;
  /** Current runtime value (any type) */
  value?: unknown;
  /** Type of the current value */
  valueType?: string;
}

/**
 * Response containing all ports with complete status for a node
 */
export interface PortsWithStatusResponse {
  /** Input ports with full status */
  inputs?: PortWithStatus[];
  /** Node ID */
  nodeId?: string;
  /** Output ports with full status */
  outputs?: PortWithStatus[];
}

export interface ProvisionRequest {
  /** Optional device description */
  description?: string;
  /** Unique device identifier (business ID) */
  deviceId: string;
  /** Human-readable device name */
  name: string;
  /** Organization ID to assign device to */
  orgId: string;
  /** Hardware serial number of device to provision */
  serialNumber: string;
  /** Additional Haystack tags */
  tags?: Record<string, unknown>;
}

/**
 * Phase 1: A contextual action available for a navigation node (e.g., View Logs, Discover Devices)
 */
export interface QuickAction {
  /** Indicates if this action is destructive (e.g., delete, restart) */
  dangerous?: boolean;
  /** Icon name for the action button */
  icon?: string;
  /** Unique identifier for the action */
  id: string;
  /** Display label for the action button */
  label: string;
  /** HTTP method (GET, POST, etc.) */
  method?: string;
  /** URL to execute the action */
  url: string;
}

export interface RedoRequest {
  /** Descriptive comment for audit trail */
  comment?: string;
}

/**
 * Batch update order for multiple refs
 */
export interface RefBatchReorderRequest {
  /** Array of ref order updates */
  updates: { fromNodeId: string; order: number; refName: string; toNodeId: string }[];
}

/**
 * Create or update a typed reference between nodes
 */
export interface RefCreate {
  /** Reference name (e.g., "siteRef", "equipRef", "deviceRef", "templateRef") */
  refName: string;
  /** Target node ID */
  toNodeId: string;
}

/**
 * List of refs
 */
export interface RefListResponse {
  /** Total number of refs */
  count?: number;
  refs?: RefResponse[];
}

/**
 * Single ref response
 */
export interface RefResponse {
  /** Creation timestamp */
  createdAt?: string;
  /** Source node ID */
  fromNodeId?: string;
  /** Organization ID */
  orgId?: string;
  /** Reference name */
  refName?: string;
  /** Target node ID */
  toNodeId?: string;
  /** Last update timestamp */
  updatedAt?: string;
}

/**
 * Information about the root/supervisor device
 */
export interface RootDeviceInfo {
  /** From config device.id */
  deviceId: string;
  /** From config device.name */
  deviceName?: string;
  /** NATS configuration */
  nats: NatsInfo;
  /** From config device.role (supervisor-device, field-device, gateway-device) */
  role: string;
  /** Device status */
  status: RootDeviceInfoStatus;
  /** Always "supervisor-device" for root */
  type: string;
  /** Uptime in seconds */
  uptime?: number;
  /** Rubix version */
  version?: string;
}

/**
 * Information about a rubix.rubix_device node
 */
export interface RubixDeviceInfo {
  /** Creation timestamp */
  createdAt?: string;
  /** Logical device ID */
  deviceId: string;
  /** Discovery timestamp */
  discoveredAt?: string;
  /** Firmware version */
  firmware?: string;
  /** e.g., "RubixCompute" */
  hardwareModel?: string;
  /** Hardware version */
  hardwareVersion?: string;
  /** Last update timestamp */
  lastUpdated?: string;
  /** Device name */
  name: string;
  /** nodeId of parent rubix.network */
  networkRef?: string;
  /** Node ID from DB */
  nodeId: string;
  /** Organization ID if provisioned */
  provisionedOrgId?: string;
  /** "edge", "gateway", "field" */
  role?: string;
  /** Hardware serial number */
  serialNumber?: string;
  /** "discovered", "provisioned", "offline" */
  status?: string;
  /** Always "rubix.rubix_device" */
  type: string;
  /** Last update timestamp */
  updatedAt?: string;
}

export interface RubixNetworkCreate {
  config?: Record<string, unknown>;
  name: string;
}

export interface RubixNetworkUpdate {
  config?: Record<string, unknown>;
  name?: string;
}

/**
 * All cached port values in the runtime
 */
export interface RuntimeAllValuesResponse {
  /** Number of nodes with values */
  nodeCount?: number;
  /** When this snapshot was taken */
  timestamp?: string;
  /** Node values (node ID -> port values) */
  values?: Record<string, NodeValuesInfo>;
}

/**
 * Cached port values for a specific node
 */
export interface RuntimeNodeValuesResponse {
  /** Input port values (port handle -> value info) */
  inputs?: Record<string, PortValueInfo>;
  /** Node ID */
  nodeId?: string;
  /** Node type (e.g., core.counter) */
  nodeType?: string;
  /** Output port values (port handle -> value info) */
  outputs?: Record<string, PortValueInfo>;
}

/**
 * Runtime V2 status response
 */
export interface RuntimeV2Status {
  /** Number of edges loaded */
  edgeCount?: number;
  /** Error message if status is error */
  error?: string;
  /** Flow ID */
  flowId?: string;
  /** Number of nodes loaded */
  nodeCount?: number;
  /** Organization ID */
  orgId?: string;
  /** When runtime was started */
  startTime?: string;
  /** Runtime status */
  status?: RuntimeV2StatusStatus;
  /** Runtime uptime duration */
  uptime?: string;
}

export interface RxAIAction {
  /** Type of action (query_executed, value_set, etc.) */
  actionType?: string;
  createdAt?: string;
  /** Action details */
  details?: {  };
  id?: string;
  orgId?: string;
  /** ID of affected resource */
  resourceId?: string;
  sessionId?: string;
}

export interface RxAIAgentResponse {
  /** Agent response text */
  content?: string;
  /** Number of tool execution iterations */
  iterations?: number;
  /** Model used for generation */
  model?: string;
  /** Session key for tracking */
  sessionKey?: string;
  /** Total tokens used */
  tokensUsed?: number;
  /** Tools executed by the agent */
  toolCalls?: RxAIToolCall[];
}

export interface RxAICreateSessionRequest {
  /** Session-specific configuration */
  config?: { enabledTools?: string[]; maxTokens?: number; model?: string; systemPrompt?: string; temperature?: number };
  /** Session description */
  description?: string;
  /** Session name */
  name?: string;
}

export interface RxAIInteraction {
  createdAt?: string;
  id?: string;
  /** User message */
  message?: string;
  /** Interaction metadata (tokens, model, tool calls) */
  metadata?: {  };
  orgId?: string;
  /** Agent response */
  response?: string;
  sessionId?: string;
  userId?: string;
}

export interface RxAISendMessageRequest {
  /** User message to the agent */
  message: string;
  /** Message metadata for controlling agent behavior */
  meta?: { mode?: 'agent' | 'ask' | 'plan'; sources?: RxAISource[]; tool?: 'auto' | 'db' | 'rubix' };
}

export interface RxAISession {
  /** Completion timestamp */
  completedAt?: string;
  /** Session configuration */
  config?: {  };
  /** Creation timestamp */
  createdAt?: string;
  /** Session description */
  description?: string;
  /** Session ID */
  id?: string;
  /** Session name */
  name?: string;
  /** Organization ID */
  orgId?: string;
  /** Session status */
  status?: RxAISessionStatus;
  /** Last update timestamp */
  updatedAt?: string;
  /** User who created the session */
  userId?: string;
}

export interface RxAISource {
  /** Source-type-specific payload (e.g. {nodeId, pageView} for page, {url} for url, {content} for text, {nodeId} for node) */
  data: {  };
  /** Display label shown in the UI chip */
  label?: string;
  /** Source type: page (current UI page), url (external URL), text (free text note), node (node by ID) */
  type: RxAISourceType;
}

export interface RxAIToolCall {
  /** Tool arguments */
  arguments?: {  };
  /** Execution duration in milliseconds */
  duration?: number;
  /** Error message if tool failed */
  error?: string;
  /** Tool name */
  name?: string;
  /** Tool execution result */
  result?: {  };
}

/**
 * Response containing JSON schema for a specific node type
 */
export interface SchemaResponse {
  /** The node type identifier (e.g., "ui.page", "core.trigger") */
  nodeType?: string;
  /** JSON Schema object defining the structure and validation rules for the node's settings */
  schema?: Record<string, unknown>;
}

/**
 * Response containing all registered JSON schemas
 */
export interface SchemasListResponse {
  /** Total number of registered schemas */
  count?: number;
  /** Map of node types to their JSON schemas */
  schemas?: Record<string, {  }>;
}

export interface SignupRequest {
  /** Device type - cloud (supervisor) or edge (field device) */
  deviceType?: SignupRequestDeviceType;
  email: string;
  /** Base64-encoded favicon (optional) */
  faviconBase64?: string;
  /** Base64-encoded logo for dark backgrounds (optional) */
  logoDarkBase64?: string;
  /** Base64-encoded logo for light backgrounds (optional) */
  logoLightBase64?: string;
  orgName: string;
  password: string;
  /** Supervisor device name (required for edge devices) */
  supervisorDeviceName?: string;
}

export interface SignupResponse {
  /** Device ID */
  deviceId: string;
  /** Device type selected during signup */
  deviceType?: SignupResponseDeviceType;
  /** User email address */
  email: string;
  /** URLs to uploaded logo files */
  logoUrls?: { dark?: string; favicon?: string; light?: string };
  /** Organization ID */
  orgId: string;
  /** User role (typically org-admin) */
  role: string;
  /** Supervisor device name (for edge devices) */
  supervisorDeviceName?: string;
  /** JWT authentication token */
  token: string;
  /** User ID */
  userId: string;
  /** Username (typically same as email) */
  username?: string;
}

export interface SyncAuditLog {
  action?: string;
  id?: string;
  timestamp?: string;
}

export interface SyncAuditLogListResponse {
  logs?: {  }[];
}

export interface SyncAuditLogResponse {
  log?: Record<string, unknown>;
}

export interface SyncAuditStatsResponse {
  failed?: number;
  successful?: number;
  total?: number;
}

export interface SyncConfig {
  enabled?: boolean;
  interval?: number;
}

export interface SyncConfigResponse {
  config?: Record<string, unknown>;
}

export interface SyncStatusResponse {
  lastSync?: string;
  status?: string;
}

export interface TagCreate {
  /** Tag name (e.g., "temp", "sensor", "site") */
  tagName: string;
  /** Tag value (omit or null for marker tags) */
  tagValue?: string;
}

export interface TagUpdate {
  /** New tag value */
  tagValue: string;
}

export interface TeamResponse {
  description?: string;
  id?: string;
  name?: string;
}

export interface TeamsResponse {
  teams?: {  }[];
}

export interface UndoComment {
  /** Descriptive comment for audit trail */
  comment?: string;
}

export interface UndoRequest {
  /** Descriptive comment for audit trail */
  comment?: string;
}

/**
 * Request to update history configuration for a port
 */
export interface UpdateHistoryConfigRequest {
  /** Enable or disable history persistence */
  historyEnabled?: boolean;
  /** Interval in seconds for interval-based policies */
  historyInterval?: number;
  /** History recording policy */
  historyPolicy?: UpdateHistoryConfigRequestHistoryPolicy;
  /** Threshold for cov_threshold policy */
  historyThreshold?: number;
}

export interface UpdateSyncConfigRequest {
  enabled?: boolean;
  interval?: number;
}

export interface UpdateTeamRequest {
  description?: string;
  name?: string;
}

export interface UpdateUserRequest {
  name?: string;
  role?: string;
}

export interface UserResponse {
  createdAt?: string;
  email?: string;
  id?: string;
  name?: string;
  orgId?: string;
  role?: string;
  /** Node settings (only included when includeSettings=true) */
  settings?: Record<string, unknown>;
  teamId?: string;
  teamName?: string;
  updatedAt?: string;
}

export interface UsersResponse {
  users?: {  }[];
}

