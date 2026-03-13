import type { AdminOrgCreate, AlarmListResponse, BulkCommandResponse, BulkCreateRequest, BulkUpdateEdgesRequest, BulkUpdateNodesRequest, CommandDefinition, CommandJob, CreateTeamRequest, DeviceBlacklist, DeviceCreate, DeviceUpdate, DisableOrgRequest, EdgeCreate, EdgeUpdate, EmailQueue, EnableOrgRequest, FlowCreate, FlowUpdate, HistoryNodesResponse, HistoryPortConfigResponse, HistoryStatsResponse, InviteUserRequest, LoginRequest, LoginResponse, MessageResponse, NavItemResponse, NavTreeResponse, NetworkDevice, Node, NodeCreate, NodeDataStoreItem, NodeListResponse, NodePortValuesResponse, NodeSettingsSchemaResponse, NodeUpdate, OrgCreate, OrgInfo, OrgStatusResponse, OrgUpdate, PageStructureNode, PortMapping, PortSubscription, PortsWithStatusResponse, ProvisionRequest, RedoRequest, RefBatchReorderRequest, RefCreate, RefListResponse, RefResponse, RuntimeAllValuesResponse, RuntimeNodeValuesResponse, RxAICreateSessionRequest, RxAISendMessageRequest, SchemaResponse, SchemasListResponse, SignupRequest, SignupResponse, TagCreate, TagUpdate, TeamResponse, TeamsResponse, UndoComment, UndoRequest, UpdateHistoryConfigRequest, UpdateTeamRequest, UpdateUserRequest, UserResponse, UsersResponse } from './types';
export declare const DEFAULT_BASE_URL = "/api/v1";
export interface HttpRequest {
    method: string;
    url: string;
    headers?: Record<string, string>;
    body?: any;
    signal?: AbortSignal;
}
export interface RequestOptions {
    headers?: Record<string, string>;
    signal?: AbortSignal;
}
export type HttpClient = (req: HttpRequest) => Promise<{
    status: number;
    statusText: string;
    headers: Record<string, string | string[]>;
    data: any;
}>;
export declare class RASError extends Error {
    status: number;
    statusText: string;
    url: string;
    details: any;
    constructor(status: number, statusText: string, url: string, details?: any);
}
export declare function buildQuery(q: Record<string, string | number | boolean | undefined | null>): string;
export declare function fetchAdapter(fetchImpl?: typeof fetch): HttpClient;
export declare function axiosAdapter(axios: any): HttpClient;
export declare class BaseClient {
    protected baseURL: string;
    protected http: HttpClient;
    protected defaultHeaders?: Record<string, string> | undefined;
    constructor(baseURL: string, http: HttpClient, defaultHeaders?: Record<string, string> | undefined);
    protected request(req: HttpRequest, opts?: RequestOptions): Promise<any>;
}
export declare class AdminClient extends BaseClient {
    /**
     * Disable organization (non-payment, suspension)
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    disableOrg(params: {
        orgId: string;
        body: DisableOrgRequest;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Re-enable previously disabled organization
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    enableOrg(params: {
        orgId: string;
        body: EnableOrgRequest;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Get organization status
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<OrgStatusResponse>
     */
    getOrgStatus(params: {
        orgId: string;
    }, opts?: RequestOptions): Promise<OrgStatusResponse>;
}
export declare class AiClient extends BaseClient {
    /**
     * Apply an AI recommendation
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    applyRecommendation(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Approve an AI recommendation
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    approveRecommendation(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Apply multiple recommendations in batch
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    batchApplyRecommendations(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Clone an existing AI prompt template
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    cloneTemplate(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Execute AI completion request
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    complete(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Create new AI provider
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    createProvider(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Create new AI prompt template
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    createTemplate(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Delete an AI provider
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    deleteProvider(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Delete an AI prompt template
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    deleteTemplate(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get AI service configuration
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    getConfig(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get details of a single AI recommendation
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    getRecommendation(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get recommendation acceptance rates and effectiveness
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    getRecommendationAnalytics(params: {
        orgId: string;
        deviceId: string;
        timeRange?: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get details of a single AI prompt template
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    getTemplate(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get AI usage statistics and analytics
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    getUsageStats(params: {
        orgId: string;
        deviceId: string;
        timeRange?: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * List configured AI providers
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    listProviders(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * List AI recommendations
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    listRecommendations(params: {
        orgId: string;
        deviceId: string;
        status?: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * List AI request history
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    listRequests(params: {
        orgId: string;
        deviceId: string;
        limit?: number;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * List AI prompt templates
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    listTemplates(params: {
        orgId: string;
        deviceId: string;
        category?: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Reject an AI recommendation
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    rejectRecommendation(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Rollback an applied AI recommendation
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    rollbackRecommendation(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Update AI service configuration
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    updateConfig(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Update an AI provider
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    updateProvider(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Update an AI prompt template
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    updateTemplate(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class AlarmClassesClient extends BaseClient {
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/alarm-classes
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        body: NodeCreate;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/alarm-classes
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NodeListResponse>
     */
    list(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<NodeListResponse>;
}
export declare class AlarmsClient extends BaseClient {
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/alarms/{id}/acknowledge
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    acknowledge(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: {
            comment?: string;
            user?: string;
        };
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/alarms/bulk/acknowledge
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    bulkAcknowledge(params: {
        orgId: string;
        deviceId: string;
        body: {
            alarmIds?: string[];
            comment?: string;
            user?: string;
        };
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/alarms/bulk/silence
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    bulkSilence(params: {
        orgId: string;
        deviceId: string;
        body: {
            alarmIds?: string[];
            durationMinutes?: number;
            reason?: string;
            user?: string;
        };
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/alarms
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        body: NodeCreate;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/alarms/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/alarms/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/alarms/{id}/history
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    history(params: {
        orgId: string;
        deviceId: string;
        id: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/alarms
     * @param params - Request parameters
     * @param params.type - Filter by alarm type (e.g., rubix.alarm-source.limit)
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<AlarmListResponse>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        type?: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<AlarmListResponse>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/alarms/{id}/silence
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    silence(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: {
            durationMinutes?: number;
            reason?: string;
            user?: string;
        };
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/alarms/stats
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    stats(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/alarms/{id}/unacknowledge
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    unacknowledge(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: {
            reason?: string;
            user?: string;
        };
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/alarms/{id}/unsilence
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    unsilence(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: {
            user?: string;
        };
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/alarms/{id}
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: NodeUpdate;
    }, opts?: RequestOptions): Promise<Node>;
}
export declare class AssociationClient extends BaseClient {
    /**
     * Create association between two nodes (user→team, nav→team, nav→user) - Admin only
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    create(params: {
        orgId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Remove a specific association - Admin only
     * @param params - Request parameters
     * @param params.refId - Ref ID to delete
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    delete(params: {
        orgId: string;
        refId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * List all associations for a node (excludes parentRef) - Admin only
     * @param params - Request parameters
     * @param params.nodeId - Node ID to get associations for (nav, user, or team)
     * @param params.nodeType - Filter by related node type (e.g., auth.user, auth.team, ui.nav). If empty, returns all associations.
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    list(params: {
        orgId: string;
        nodeId: string;
        nodeType?: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Search for nodes by name to facilitate association - Admin only
     * @param params - Request parameters
     * @param params.q - Search query (node name)
     * @param params.sourceNodeType - Source node type to auto-filter valid association targets (e.g., ui.nav, auth.user, auth.team)
     * @param params.types - Explicit filter by node types (overrides sourceNodeType)
     * @param params.limit - Maximum number of results (max 100)
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    search(params: {
        orgId: string;
        q: string;
        sourceNodeType?: string;
        types?: unknown[];
        limit?: number;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class AuditClient extends BaseClient {
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/audit/history
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    history(params: {
        orgId: string;
        deviceId: string;
        sessionUUID: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/audit/redo/{undoAuditId}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    redo(params: {
        orgId: string;
        deviceId: string;
        undoAuditId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/audit/redoable
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    redoable(params: {
        orgId: string;
        deviceId: string;
        sessionUUID: string;
        limit?: number;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/audit/undo/{auditId}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    undo(params: {
        orgId: string;
        deviceId: string;
        auditId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/audit/undoable
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    undoable(params: {
        orgId: string;
        deviceId: string;
        sessionUUID: string;
        limit?: number;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class AuthClient extends BaseClient {
    /**
     * Login with email and password
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<LoginResponse>
     */
    login(params: {
        body: LoginRequest;
    }, opts?: RequestOptions): Promise<LoginResponse>;
    /**
     * Invalidate JWT token
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    logout(params: {}, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Create new organization and admin user
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<SignupResponse>
     */
    signup(params: {
        body: SignupRequest;
    }, opts?: RequestOptions): Promise<SignupResponse>;
}
export declare class BackupClient extends BaseClient {
    /**
     * DELETE /orgs/{orgId}/backup/{backupId}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ id?: string; message?: string }>
     */
    delete(params: {
        orgId: string;
        backupId: string;
    }, opts?: RequestOptions): Promise<{
        id?: string;
        message?: string;
    }>;
    /**
     * DELETE /orgs/{orgId}/backup/files/{filename}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ filename?: string; message?: string }>
     */
    deleteFile(params: {
        orgId: string;
        filename: string;
    }, opts?: RequestOptions): Promise<{
        filename?: string;
        message?: string;
    }>;
    /**
     * GET /orgs/{orgId}/backup/files/{filename}/download
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    downloadFile(params: {
        orgId: string;
        filename: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * POST /orgs/{orgId}/backup/export
     * @param params - Request parameters
     * @param params.stream - Stream backup directly instead of creating async job
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: 'pending' | 'running' | 'completed' | 'failed'; type?: string }>
     */
    export(params: {
        orgId: string;
        stream?: boolean;
        body: {
            compression?: boolean;
            prettyPrint?: boolean;
        };
    }, opts?: RequestOptions): Promise<{
        createdAt?: string;
        id?: string;
        message?: string;
        orgId?: string;
        progress?: number;
        status?: 'pending' | 'running' | 'completed' | 'failed';
        type?: string;
    }>;
    /**
     * GET /orgs/{orgId}/backup/export/{jobId}/download
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    exportDownload(params: {
        orgId: string;
        jobId: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * GET /orgs/{orgId}/backup/export/{jobId}/status
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ completedAt?: string; createdAt?: string; currentStep?: string; errors?: string[]; id?: string; message?: string; orgId?: string; progress?: number; resultPath?: string; status?: string; type?: string }>
     */
    exportStatus(params: {
        orgId: string;
        jobId: string;
    }, opts?: RequestOptions): Promise<{
        completedAt?: string;
        createdAt?: string;
        currentStep?: string;
        errors?: string[];
        id?: string;
        message?: string;
        orgId?: string;
        progress?: number;
        resultPath?: string;
        status?: string;
        type?: string;
    }>;
    /**
     * GET /orgs/{orgId}/backup/chain
     * @param params - Request parameters
     * @param params.targetTime - Target timestamp for point-in-time restore (RFC3339)
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ baseBackup?: string; incrementals?: string[]; targetTime?: string }>
     */
    getBackupChain(params: {
        orgId: string;
        targetTime: string;
    }, opts?: RequestOptions): Promise<{
        baseBackup?: string;
        incrementals?: string[];
        targetTime?: string;
    }>;
    /**
     * POST /orgs/{orgId}/backup/import
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }>
     */
    import(params: {
        orgId: string;
        body: unknown;
    }, opts?: RequestOptions): Promise<{
        createdAt?: string;
        id?: string;
        message?: string;
        orgId?: string;
        progress?: number;
        status?: string;
        type?: string;
    }>;
    /**
     * GET /orgs/{orgId}/backup/import/{jobId}/status
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ completedAt?: string; createdAt?: string; currentStep?: string; errors?: string[]; id?: string; importReport?: { backupMetadata?: Record<string, unknown>; conflictMode?: string; durationMs?: number; endTime?: string; idMappings?: { edges?: Record<string, string>; nodes?: Record<string, string>; ports?: Record<string, string>; refs?: Record<string, string> }; preserveIds?: boolean; startTime?: string; summary?: { failedRecords?: number; importedRecords?: number; skippedRecords?: number; tablesProcessed?: number; totalRecords?: number }; tables?: Record<string, { durationMs?: number; endTime?: string; errors?: string[]; failedRecords?: number; importedRecords?: number; sampleImported?: string[]; sampleSkipped?: string[]; skippedRecords?: number; startTime?: string; tableName?: string; totalRecords?: number }> }; message?: string; orgId?: string; progress?: number; status?: string; type?: string; validationResult?: { errors?: Record<string, unknown>[]; valid?: boolean; warnings?: Record<string, unknown>[] } }>
     */
    importStatus(params: {
        orgId: string;
        jobId: string;
    }, opts?: RequestOptions): Promise<{
        completedAt?: string;
        createdAt?: string;
        currentStep?: string;
        errors?: string[];
        id?: string;
        importReport?: {
            backupMetadata?: Record<string, unknown>;
            conflictMode?: string;
            durationMs?: number;
            endTime?: string;
            idMappings?: {
                edges?: Record<string, string>;
                nodes?: Record<string, string>;
                ports?: Record<string, string>;
                refs?: Record<string, string>;
            };
            preserveIds?: boolean;
            startTime?: string;
            summary?: {
                failedRecords?: number;
                importedRecords?: number;
                skippedRecords?: number;
                tablesProcessed?: number;
                totalRecords?: number;
            };
            tables?: Record<string, {
                durationMs?: number;
                endTime?: string;
                errors?: string[];
                failedRecords?: number;
                importedRecords?: number;
                sampleImported?: string[];
                sampleSkipped?: string[];
                skippedRecords?: number;
                startTime?: string;
                tableName?: string;
                totalRecords?: number;
            }>;
        };
        message?: string;
        orgId?: string;
        progress?: number;
        status?: string;
        type?: string;
        validationResult?: {
            errors?: Record<string, unknown>[];
            valid?: boolean;
            warnings?: Record<string, unknown>[];
        };
    }>;
    /**
     * POST /orgs/{orgId}/backup/incremental/export
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }>
     */
    incrementalExport(params: {
        orgId: string;
        body: {
            compression?: boolean;
            prettyPrint?: boolean;
            since?: string;
            until?: string;
            useHash?: boolean;
        };
    }, opts?: RequestOptions): Promise<{
        createdAt?: string;
        id?: string;
        message?: string;
        orgId?: string;
        progress?: number;
        status?: string;
        type?: string;
    }>;
    /**
     * POST /orgs/{orgId}/backup/incremental/import
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }>
     */
    incrementalImport(params: {
        orgId: string;
        body: unknown;
    }, opts?: RequestOptions): Promise<{
        createdAt?: string;
        id?: string;
        message?: string;
        orgId?: string;
        progress?: number;
        status?: string;
        type?: string;
    }>;
    /**
     * GET /orgs/{orgId}/backup/files
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: { filename?: string; modifiedAt?: string; size?: number; type?: string }[]; meta?: { total?: number } }>
     */
    listFiles(params: {
        orgId: string;
    }, opts?: RequestOptions): Promise<{
        data?: {
            filename?: string;
            modifiedAt?: string;
            size?: number;
            type?: string;
        }[];
        meta?: {
            total?: number;
        };
    }>;
    /**
     * GET /orgs/{orgId}/backup/jobs
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: { createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }[]; meta?: { total?: number } }>
     */
    listJobs(params: {
        orgId: string;
    }, opts?: RequestOptions): Promise<{
        data?: {
            createdAt?: string;
            id?: string;
            message?: string;
            orgId?: string;
            progress?: number;
            status?: string;
            type?: string;
        }[];
        meta?: {
            total?: number;
        };
    }>;
    /**
     * POST /orgs/{orgId}/backup/point-in-time/restore
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }>
     */
    pointInTimeRestore(params: {
        orgId: string;
        body: {
            baseBackupPath?: string;
            incrementalPaths?: string[];
            targetTime?: string;
            validateOnly?: boolean;
        };
    }, opts?: RequestOptions): Promise<{
        createdAt?: string;
        id?: string;
        message?: string;
        orgId?: string;
        progress?: number;
        status?: string;
        type?: string;
    }>;
    /**
     * POST /orgs/{orgId}/backup/validate
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ errors?: { code?: string; field?: string; message?: string; recordId?: string; table?: string }[]; valid?: boolean; warnings?: { message?: string; table?: string }[] }>
     */
    validate(params: {
        orgId: string;
        body: unknown;
    }, opts?: RequestOptions): Promise<{
        errors?: {
            code?: string;
            field?: string;
            message?: string;
            recordId?: string;
            table?: string;
        }[];
        valid?: boolean;
        warnings?: {
            message?: string;
            table?: string;
        }[];
    }>;
}
export declare class DatastoreClient extends BaseClient {
    /**
     * Count entries in a node's datastore bucket
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ bucket?: string; count?: number; nodeId?: string }>
     */
    count(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        bucket?: string;
    }, opts?: RequestOptions): Promise<{
        bucket?: string;
        count?: number;
        nodeId?: string;
    }>;
    /**
     * Create a datastore entry at index (enforces maxVersions if provided)
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NodeDataStoreItem>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        index: number;
        bucket?: string;
        maxVersions?: number;
        body: Record<string, unknown>;
    }, opts?: RequestOptions): Promise<NodeDataStoreItem>;
    /**
     * Delete a datastore entry at index
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        index: number;
        bucket?: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Get a datastore entry by index
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NodeDataStoreItem>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        index: number;
        bucket?: string;
    }, opts?: RequestOptions): Promise<NodeDataStoreItem>;
    /**
     * List datastore entries for a node bucket
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ count?: number; items?: NodeDataStoreItem[] }>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        bucket?: string;
        limit?: number;
        offset?: number;
        orderBy?: string;
    }, opts?: RequestOptions): Promise<{
        count?: number;
        items?: NodeDataStoreItem[];
    }>;
    /**
     * Update a datastore entry at index
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NodeDataStoreItem>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        index: number;
        bucket?: string;
        body: Record<string, unknown>;
    }, opts?: RequestOptions): Promise<NodeDataStoreItem>;
}
export declare class DevicesClient extends BaseClient {
    /**
     * Query communication paths between devices based on NATS pub/sub patterns
     * @param params - Request parameters
     * @param params.from - Comma-separated device names or 'all' (default: all)
     * @param params.to - Comma-separated device names or 'all' (default: all)
     * @param params.network - NATS network to query: local or global
     * @param params.detail - Detail level: basic or full
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ network?: 'local' | 'global'; query?: { from?: string[]; to?: string[] }; routes?: { details?: { fromConnectionId?: number; messageCount?: number; publishers?: string[]; subscribers?: string[]; toConnectionId?: number }; from?: string; matchedSubjects?: string[]; status?: 'active' | 'inactive' | 'broken'; to?: string }[]; summary?: { activeRoutes?: number; brokenRoutes?: number; totalRoutes?: number }; timestamp?: string }>
     */
    communicationQuery(params: {
        orgId: string;
        deviceId: string;
        from?: string;
        to?: string;
        network?: 'local' | 'global';
        detail?: 'basic' | 'full';
    }, opts?: RequestOptions): Promise<{
        network?: 'local' | 'global';
        query?: {
            from?: string[];
            to?: string[];
        };
        routes?: {
            details?: {
                fromConnectionId?: number;
                messageCount?: number;
                publishers?: string[];
                subscribers?: string[];
                toConnectionId?: number;
            };
            from?: string;
            matchedSubjects?: string[];
            status?: 'active' | 'inactive' | 'broken';
            to?: string;
        }[];
        summary?: {
            activeRoutes?: number;
            brokenRoutes?: number;
            totalRoutes?: number;
        };
        timestamp?: string;
    }>;
    /**
     * Test message routing to see which devices would receive a message
     * @param params - Request parameters
     * @param params.network - NATS network to query: local or global
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ network?: 'local' | 'global'; results?: { connectionStatus?: 'active' | 'inactive'; device?: string; matchedPatterns?: { connectionId?: number; matchType?: string; pattern?: string }[]; reason?: string; subscriptions?: string[]; wouldReceive?: boolean }[]; summary?: { totalDevices?: number; wouldNotReceive?: number; wouldReceive?: number }; test?: { from?: string[]; subject?: string; to?: string[] }; timestamp?: string }>
     */
    communicationTest(params: {
        orgId: string;
        deviceId: string;
        network?: 'local' | 'global';
        body: {
            from?: string[];
            includeInactive?: boolean;
            subject?: string;
            to?: string[];
        };
    }, opts?: RequestOptions): Promise<{
        network?: 'local' | 'global';
        results?: {
            connectionStatus?: 'active' | 'inactive';
            device?: string;
            matchedPatterns?: {
                connectionId?: number;
                matchType?: string;
                pattern?: string;
            }[];
            reason?: string;
            subscriptions?: string[];
            wouldReceive?: boolean;
        }[];
        summary?: {
            totalDevices?: number;
            wouldNotReceive?: number;
            wouldReceive?: number;
        };
        test?: {
            from?: string[];
            subject?: string;
            to?: string[];
        };
        timestamp?: string;
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/devices
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        body: DeviceCreate;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/devices/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/devices/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * Get comprehensive device information including root device and all child devices
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ childDevices?: { deviceId?: string; hardwareModel?: string; name?: string; nodeId?: string; role?: string; serialNumber?: string; status?: 'online' | 'offline' | 'discovered' | 'provisioned'; type?: string }[]; orgId?: string; rootDevice?: { deviceId?: string; deviceName?: string; nats?: { globalStatus?: string; globalUrl?: string; localStatus?: string; localUrl?: string }; role?: string; status?: 'online' | 'offline'; type?: string; uptime?: number; version?: string }; stats?: { offlineDevices?: number; onlineDevices?: number; totalDevices?: number }; timestamp?: string }>
     */
    getInfo(params: {
        orgId: string;
    }, opts?: RequestOptions): Promise<{
        childDevices?: {
            deviceId?: string;
            hardwareModel?: string;
            name?: string;
            nodeId?: string;
            role?: string;
            serialNumber?: string;
            status?: 'online' | 'offline' | 'discovered' | 'provisioned';
            type?: string;
        }[];
        orgId?: string;
        rootDevice?: {
            deviceId?: string;
            deviceName?: string;
            nats?: {
                globalStatus?: string;
                globalUrl?: string;
                localStatus?: string;
                localUrl?: string;
            };
            role?: string;
            status?: 'online' | 'offline';
            type?: string;
            uptime?: number;
            version?: string;
        };
        stats?: {
            offlineDevices?: number;
            onlineDevices?: number;
            totalDevices?: number;
        };
        timestamp?: string;
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/devices
     * @param params - Request parameters
     * @param params.siteId - Filter by site/parent (e.g., site--sydney)
     * @param params.type - Filter by device type (e.g., ahu, vav, chiller)
     * @param params.tags - Additional tag filters as JSON (e.g., {"floor":"3"})
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node[]; total?: number }>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        siteId?: string;
        type?: string;
        tags?: string;
    }, opts?: RequestOptions): Promise<{
        data?: Node[];
        total?: number;
    }>;
    /**
     * Get NATS monitoring statistics for network connections and subscriptions
     * @param params - Request parameters
     * @param params.network - NATS network to query: local or global
     * @param params.format - Response format: raw (all endpoints) or parsed (analyzed data)
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ connections?: { cid?: number; device?: string; ip?: string; name?: string; subscriptions?: number }[]; connz?: Record<string, unknown>; deviceStats?: Record<string, { connectionId?: number; deviceId?: string; inMessages?: number; outMessages?: number; subjects?: string[]; subscriptions?: number }>; natsMonitoring?: { available?: boolean; error?: string }; network?: 'local' | 'global'; serverInfo?: { connections?: number; serverId?: string; subscriptions?: number; totalBytes?: number; totalMessages?: number; uptime?: string; version?: string }; subscriptions?: { device?: string; msgs?: number; subject?: string }[]; subsz?: Record<string, unknown>; timestamp?: string; varz?: Record<string, unknown> }>
     */
    networkStats(params: {
        orgId: string;
        deviceId: string;
        network?: 'local' | 'global';
        format?: 'raw' | 'parsed';
    }, opts?: RequestOptions): Promise<{
        connections?: {
            cid?: number;
            device?: string;
            ip?: string;
            name?: string;
            subscriptions?: number;
        }[];
        connz?: Record<string, unknown>;
        deviceStats?: Record<string, {
            connectionId?: number;
            deviceId?: string;
            inMessages?: number;
            outMessages?: number;
            subjects?: string[];
            subscriptions?: number;
        }>;
        natsMonitoring?: {
            available?: boolean;
            error?: string;
        };
        network?: 'local' | 'global';
        serverInfo?: {
            connections?: number;
            serverId?: string;
            subscriptions?: number;
            totalBytes?: number;
            totalMessages?: number;
            uptime?: string;
            version?: string;
        };
        subscriptions?: {
            device?: string;
            msgs?: number;
            subject?: string;
        }[];
        subsz?: Record<string, unknown>;
        timestamp?: string;
        varz?: Record<string, unknown>;
    }>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/devices/{id}
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: DeviceUpdate;
    }, opts?: RequestOptions): Promise<Node>;
}
export declare class DiagnosticsClient extends BaseClient {
    /**
     * Overall system health check - runtime, history, sync, NATS, database, scheduler
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ components?: Record<string, unknown>; status?: 'healthy' | 'degraded' | 'unhealthy'; summary?: string; timestamp?: string }>
     */
    health(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        components?: Record<string, unknown>;
        status?: 'healthy' | 'degraded' | 'unhealthy';
        summary?: string;
        timestamp?: string;
    }>;
    /**
     * Check if a specific node is loaded and running in the runtime
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ lastExecution?: string; nodeInfo?: Record<string, unknown>; nodeLoaded?: boolean; outputs?: Record<string, unknown>; runtimeRunning?: boolean }>
     */
    nodeStatus(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<{
        lastExecution?: string;
        nodeInfo?: Record<string, unknown>;
        nodeLoaded?: boolean;
        outputs?: Record<string, unknown>;
        runtimeRunning?: boolean;
    }>;
}
export declare class DocsClient extends BaseClient {
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/docs/manifest
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    manifest(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/docs/{sectionId}/{pageId}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    page(params: {
        orgId: string;
        deviceId: string;
        sectionId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/docs/search
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    search(params: {
        orgId: string;
        deviceId: string;
        q: string;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class EdgesClient extends BaseClient {
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/edges/bulk
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ createdCount?: number; edges?: Edge[] }>
     */
    bulkCreate(params: {
        orgId: string;
        deviceId: string;
        body: unknown[];
    }, opts?: RequestOptions): Promise<{
        createdCount?: number;
        edges?: Edge[];
    }>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/edges/bulk
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ deletedCount?: number; message?: string }>
     */
    bulkDelete(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        deletedCount?: number;
        message?: string;
    }>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/edges/bulk
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ edges?: Edge[]; updatedCount?: number }>
     */
    bulkUpdate(params: {
        orgId: string;
        deviceId: string;
        body: BulkUpdateEdgesRequest;
    }, opts?: RequestOptions): Promise<{
        edges?: Edge[];
        updatedCount?: number;
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/edges
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Edge>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        body: EdgeCreate;
    }, opts?: RequestOptions): Promise<Edge>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/edges/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/edges/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Edge>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<Edge>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/edges
     * @param params - Request parameters
     * @param params.source - Filter by source node ID
     * @param params.target - Filter by target node ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Edge[]>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        source?: string;
        target?: string;
    }, opts?: RequestOptions): Promise<Edge[]>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/edges/{id}
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Edge>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: EdgeUpdate;
    }, opts?: RequestOptions): Promise<Edge>;
}
export declare class EmailQueueClient extends BaseClient {
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/email-queue/bulk/delete
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ deletedCount?: number; message?: string }>
     */
    bulkDelete(params: {
        orgId: string;
        deviceId: string;
        body: {
            emailIds?: string[];
            status?: string;
        };
    }, opts?: RequestOptions): Promise<{
        deletedCount?: number;
        message?: string;
    }>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/email-queue/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ emailId?: string; message?: string }>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<{
        emailId?: string;
        message?: string;
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/email-queue/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<EmailQueue>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<EmailQueue>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/email-queue
     * @param params - Request parameters
     * @param params.status - Filter by status (pending, sending, sent, failed)
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: EmailQueue[]; total?: number }>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        status?: string;
        limit?: number;
    }, opts?: RequestOptions): Promise<{
        data?: EmailQueue[];
        total?: number;
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/email-queue/{id}/resend
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ emailId?: string; message?: string; status?: string }>
     */
    resend(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<{
        emailId?: string;
        message?: string;
        status?: string;
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/email-queue/stats
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ orgId?: string; stats?: Record<string, number>; total?: number }>
     */
    stats(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        orgId?: string;
        stats?: Record<string, number>;
        total?: number;
    }>;
}
export declare class FlowsClient extends BaseClient {
    /**
     * Create flow for org (normally auto-created on org creation)
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Flow>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        body: FlowCreate;
    }, opts?: RequestOptions): Promise<Flow>;
    /**
     * Delete flow and ALL its nodes/edges - DANGEROUS!
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Get flow metadata (status, name, etc.) - Always returns the 'main' flow
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Flow>
     */
    get(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<Flow>;
    /**
     * Get complete flow graph (nodes + edges) for React Flow - Optimized single query
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ edges?: Edge[]; flow?: Flow; nodes?: Node[] }>
     */
    snapshot(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        edges?: Edge[];
        flow?: Flow;
        nodes?: Node[];
    }>;
    /**
     * Update flow metadata (e.g., status: running/stopped)
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Flow>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        body: FlowUpdate;
    }, opts?: RequestOptions): Promise<Flow>;
}
export declare class HierarchyClient extends BaseClient {
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/hierarchy/tree
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    getfulltree(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/hierarchy/stats
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    getstats(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/hierarchy/grouped
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    listgrouped(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/hierarchy/orphans
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    listorphans(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class HistoriesClient extends BaseClient {
    /**
     * Get all synced history values from other devices
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ count?: number; samples?: { isSynced?: boolean; nodeId?: string; portId?: string; sourceDeviceId?: string; timestamp?: string; valueBool?: boolean; valueNum?: number; valueStr?: string }[] }>
     */
    all(params: {
        orgId: string;
        deviceId: string;
        limit?: number;
    }, opts?: RequestOptions): Promise<{
        count?: number;
        samples?: {
            isSynced?: boolean;
            nodeId?: string;
            portId?: string;
            sourceDeviceId?: string;
            timestamp?: string;
            valueBool?: boolean;
            valueNum?: number;
            valueStr?: string;
        }[];
    }>;
    /**
     * Comprehensive history diagnostics - check if node exists, port config, registration, samples in mem/disk
     * @param params - Request parameters
     * @param params.nodeId - Node ID to diagnose
     * @param params.portHandle - Port handle (e.g., 'out')
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ details?: { historyManager?: Record<string, unknown>; node?: Record<string, unknown>; port?: Record<string, unknown>; samples?: Record<string, unknown>; sync?: Record<string, unknown> }; issues?: string[]; recommendations?: string[]; status?: 'ok' | 'warning' | 'error'; summary?: string }>
     */
    diagnostics(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portHandle: string;
    }, opts?: RequestOptions): Promise<{
        details?: {
            historyManager?: Record<string, unknown>;
            node?: Record<string, unknown>;
            port?: Record<string, unknown>;
            samples?: Record<string, unknown>;
            sync?: Record<string, unknown>;
        };
        issues?: string[];
        recommendations?: string[];
        status?: 'ok' | 'warning' | 'error';
        summary?: string;
    }>;
    /**
     * Get all ports (inputs and outputs) for a node with their history settings
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ inputs?: { handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; name?: string; type?: string }[]; nodeId?: string; nodeName?: string; outputs?: { handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; name?: string; type?: string }[] }>
     */
    getNodePorts(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<{
        inputs?: {
            handle?: string;
            historyEnabled?: boolean;
            historyInterval?: number;
            historyPolicy?: string;
            historyThreshold?: number;
            name?: string;
            type?: string;
        }[];
        nodeId?: string;
        nodeName?: string;
        outputs?: {
            handle?: string;
            historyEnabled?: boolean;
            historyInterval?: number;
            historyPolicy?: string;
            historyThreshold?: number;
            name?: string;
            type?: string;
        }[];
    }>;
    /**
     * Get history configuration for a specific port
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<HistoryPortConfigResponse>
     */
    getPortConfig(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portId: string;
    }, opts?: RequestOptions): Promise<HistoryPortConfigResponse>;
    /**
     * Get history manager statistics
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<HistoryStatsResponse>
     */
    getStats(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<HistoryStatsResponse>;
    /**
     * List all nodes with history-enabled ports
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<HistoryNodesResponse>
     */
    listEnabledNodes(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<HistoryNodesResponse>;
    /**
     * List all history-enabled ports across all nodes
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    listEnabledPorts(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get recent historical samples for a specific port
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ count?: number; dateRange?: Record<string, unknown>; samples?: unknown[] }>
     */
    portSamples(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portHandle: string;
        limit?: number;
    }, opts?: RequestOptions): Promise<{
        count?: number;
        dateRange?: Record<string, unknown>;
        samples?: unknown[];
    }>;
    /**
     * Enable/disable history and update settings (COV, interval, etc.)
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<HistoryPortConfigResponse>
     */
    updatePortConfig(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portId: string;
        body: UpdateHistoryConfigRequest;
    }, opts?: RequestOptions): Promise<HistoryPortConfigResponse>;
}
export declare class InsightsClient extends BaseClient {
    /**
     * Get AI request history for an insight
     * @param params - Request parameters
     * @param params.limit - Maximum number of results
     * @param params.offset - Offset for pagination
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    aiHistory(params: {
        orgId: string;
        deviceId: string;
        id: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Request AI analysis for an insight
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    aiRequest(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Assign an insight to a user
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    assign(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Create a new insight
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    create(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get event history for an insight
     * @param params - Request parameters
     * @param params.limit - Maximum number of results
     * @param params.offset - Offset for pagination
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    events(params: {
        orgId: string;
        deviceId: string;
        id: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get a single insight by ID
     * @param params - Request parameters
     * @param params.includeDetail - Include detailed analysis
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        id: string;
        includeDetail?: boolean;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * List insights with optional filtering
     * @param params - Request parameters
     * @param params.status - Filter by status (open, assigned, in_progress, resolved, dismissed)
     * @param params.priority - Filter by priority (critical, high, medium, low)
     * @param params.impactLevel - Filter by impact level (high, medium, low)
     * @param params.assignedTo - Filter by assigned user
     * @param params.building - Filter by building
     * @param params.category - Filter by category
     * @param params.limit - Maximum number of results
     * @param params.offset - Offset for pagination
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        status?: unknown[];
        priority?: unknown[];
        impactLevel?: unknown[];
        assignedTo?: string;
        building?: string;
        category?: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Mark insight as resolved
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    resolve(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get aggregated insights statistics
     * @param params - Request parameters
     * @param params.category - Filter statistics by category
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    stats(params: {
        orgId: string;
        deviceId: string;
        category?: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Update insight status
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    updateStatus(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class JobsClient extends BaseClient {
    /**
     * Disable a scheduler job
     * @param params - Request parameters
     * @param params.jobId - Scheduler job ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ job?: Record<string, unknown>; message?: string; success?: boolean }>
     */
    disable(params: {
        orgId: string;
        deviceId: string;
        jobId: string;
    }, opts?: RequestOptions): Promise<{
        job?: Record<string, unknown>;
        message?: string;
        success?: boolean;
    }>;
    /**
     * Enable a scheduler job
     * @param params - Request parameters
     * @param params.jobId - Scheduler job ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ job?: Record<string, unknown>; message?: string; success?: boolean }>
     */
    enable(params: {
        orgId: string;
        deviceId: string;
        jobId: string;
    }, opts?: RequestOptions): Promise<{
        job?: Record<string, unknown>;
        message?: string;
        success?: boolean;
    }>;
    /**
     * Get details of a specific scheduler job
     * @param params - Request parameters
     * @param params.jobId - Scheduler job ID (e.g., "history-flush", "port-override-timeout-...")
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ createdAt?: string; description?: string; enabled?: boolean; id?: string; name?: string; schedule?: string; stats?: Record<string, unknown>; tags?: string[]; updatedAt?: string }>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        jobId: string;
    }, opts?: RequestOptions): Promise<{
        createdAt?: string;
        description?: string;
        enabled?: boolean;
        id?: string;
        name?: string;
        schedule?: string;
        stats?: Record<string, unknown>;
        tags?: string[];
        updatedAt?: string;
    }>;
    /**
     * List all scheduler jobs (not command jobs - those are at /nodes/{nodeId}/jobs)
     * @param params - Request parameters
     * @param params.enabled - Filter by enabled status
     * @param params.tags - Filter by tags (comma-separated)
     * @param params.nodeId - Filter by node ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ count?: number; jobs?: { createdAt?: string; description?: string; enabled?: boolean; expiresIn?: string; id?: string; lastRunTimeAgo?: string; metadata?: { duration?: string; expiresAt?: string; nodeId?: string; portId?: string; type?: 'recurring' | 'one-time' }; name?: string; nextRunTimeFrom?: string; schedule?: string; stats?: { averageRuntimeMs?: number; failedRuns?: number; lastError?: string; lastRunDurationMs?: number; lastRunTime?: string; nextRunTime?: string; successfulRuns?: number; totalRuns?: number }; tags?: string[]; updatedAt?: string }[] }>
     */
    listAll(params: {
        orgId: string;
        deviceId: string;
        enabled?: boolean;
        tags?: string;
        nodeId?: string;
    }, opts?: RequestOptions): Promise<{
        count?: number;
        jobs?: {
            createdAt?: string;
            description?: string;
            enabled?: boolean;
            expiresIn?: string;
            id?: string;
            lastRunTimeAgo?: string;
            metadata?: {
                duration?: string;
                expiresAt?: string;
                nodeId?: string;
                portId?: string;
                type?: 'recurring' | 'one-time';
            };
            name?: string;
            nextRunTimeFrom?: string;
            schedule?: string;
            stats?: {
                averageRuntimeMs?: number;
                failedRuns?: number;
                lastError?: string;
                lastRunDurationMs?: number;
                lastRunTime?: string;
                nextRunTime?: string;
                successfulRuns?: number;
                totalRuns?: number;
            };
            tags?: string[];
            updatedAt?: string;
        }[];
    }>;
    /**
     * Remove a scheduler job (use with caution - may break system functionality)
     * @param params - Request parameters
     * @param params.jobId - Scheduler job ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; success?: boolean }>
     */
    remove(params: {
        orgId: string;
        deviceId: string;
        jobId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        success?: boolean;
    }>;
    /**
     * Run a scheduler job immediately (outside its schedule)
     * @param params - Request parameters
     * @param params.jobId - Scheduler job ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ jobId?: string; message?: string; success?: boolean }>
     */
    runNow(params: {
        orgId: string;
        deviceId: string;
        jobId: string;
    }, opts?: RequestOptions): Promise<{
        jobId?: string;
        message?: string;
        success?: boolean;
    }>;
    /**
     * Get overall scheduler statistics
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ disabledJobs?: number; enabledJobs?: number; totalFailures?: number; totalJobs?: number; totalRuns?: number }>
     */
    stats(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        disabledJobs?: number;
        enabledJobs?: number;
        totalFailures?: number;
        totalJobs?: number;
        totalRuns?: number;
    }>;
}
export declare class JournalClient extends BaseClient {
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/journal/transactions/{txid}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    gettransaction(params: {
        orgId: string;
        deviceId: string;
        txid: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/journal/history
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    history(params: {
        orgId: string;
        deviceId: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/journal/redo
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    redo(params: {
        orgId: string;
        deviceId: string;
        body: RedoRequest;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/journal/undo
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    undo(params: {
        orgId: string;
        deviceId: string;
        body: UndoRequest;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/journal/undo/{txid}
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    undototransaction(params: {
        orgId: string;
        deviceId: string;
        txid: string;
        body: UndoComment;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class NavClient extends BaseClient {
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/nav
     * @param params - Request parameters
     * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        allowUnknown?: boolean;
        body: NodeCreate;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/nav/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nav/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * Get all organizations (Level 1 navigation)
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ items?: { icon?: string; id?: string; label?: string; type?: string; url?: string }[] }>
     */
    getOrgs(params: {}, opts?: RequestOptions): Promise<{
        items?: {
            icon?: string;
            id?: string;
            label?: string;
            type?: string;
            url?: string;
        }[];
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nav
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node[]>
     */
    list(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<Node[]>;
    /**
     * Get immediate children of a node for lazy-loading navigation (device-scoped)
     * @param params - Request parameters
     * @param params.nodeType - Filter children by node type (e.g., rubix.network, rubix.device). Only children matching this nodeType will be returned.
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ items?: NavItemResponse[]; nodeId?: string; nodeType?: string; pages?: Record<string, unknown> }>
     */
    navChildren(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        nodeType?: string;
    }, opts?: RequestOptions): Promise<{
        items?: NavItemResponse[];
        nodeId?: string;
        nodeType?: string;
        pages?: Record<string, unknown>;
    }>;
    /**
     * Get navigation info for a specific node (for breadcrumbs, etc.)
     * @param params - Request parameters
     * @param params.orgId - Organization ID
     * @param params.deviceId - Device ID
     * @param params.nodeId - Node ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ icon?: string; name?: string; nodeId?: string; type?: string }>
     */
    navInfo(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<{
        icon?: string;
        name?: string;
        nodeId?: string;
        type?: string;
    }>;
    /**
     * Get organization sidebar (root device tree with showOrg=true)
     * @param params - Request parameters
     * @param params.orgId - Organization ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ deviceId?: string; deviceName?: string; deviceType?: string; items?: NavItemResponse[]; nodeId?: string; nodeType?: string; orgId?: string; pages?: Record<string, { icon?: string; isDefault?: boolean; order?: number; pageId?: string; source?: string; title?: string }>; showOrg?: boolean }>
     */
    orgSidebar(params: {
        orgId: string;
    }, opts?: RequestOptions): Promise<{
        deviceId?: string;
        deviceName?: string;
        deviceType?: string;
        items?: NavItemResponse[];
        nodeId?: string;
        nodeType?: string;
        orgId?: string;
        pages?: Record<string, {
            icon?: string;
            isDefault?: boolean;
            order?: number;
            pageId?: string;
            source?: string;
            title?: string;
        }>;
        showOrg?: boolean;
    }>;
    /**
     * Get hierarchical navigation tree for sidebar (device-level). Optionally includes breadcrumbs when nodeId is provided. Supports enhanced metadata (Phase 1) and smart pre-loading (Phase 2) features.
     * @param params - Request parameters
     * @param params.depth - Maximum tree depth to load (Phase 2: Smart Pre-loading). Defaults to user's MaxInitialDepth preference. Higher values load deeper tree structures in a single call.
     * @param params.includeRemoteDevices - Pre-load remote devices under network nodes (Phase 2: Smart Pre-loading). When true, reduces API calls by automatically showing devices connected to networks.
     * @param params.nodeType - Filter nodes by type (e.g., rubix.network, rubix.device). Only nodes matching this nodeType will be included in the tree.
     * @param params.nodeId - Node ID to generate breadcrumbs for
     * @param params.withBreadcrumbs - Include breadcrumbs in response (uses NATS routing for cross-device nodes)
     * @param params.pageView - Page view for deep linking
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NavTreeResponse>
     */
    sidebar(params: {
        orgId: string;
        deviceId: string;
        depth?: number;
        includeRemoteDevices?: boolean;
        nodeType?: string;
        nodeId?: string;
        withBreadcrumbs?: boolean;
        pageView?: string;
    }, opts?: RequestOptions): Promise<NavTreeResponse>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/nav/{id}
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: NodeUpdate;
    }, opts?: RequestOptions): Promise<Node>;
}
export declare class NetworkDevicesClient extends BaseClient {
    /**
     * Add a device to this device's rubix network configuration
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NetworkDevice>
     */
    addNetworkDevice(params: {
        orgId: string;
        deviceId: string;
        body: {
            id?: string;
            metadata?: Record<string, unknown>;
            name?: string;
        };
    }, opts?: RequestOptions): Promise<NetworkDevice>;
    /**
     * Get a specific network device by ID
     * @param params - Request parameters
     * @param params.networkDeviceId - Network device ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NetworkDevice>
     */
    getNetworkDevice(params: {
        orgId: string;
        deviceId: string;
        networkDeviceId: string;
    }, opts?: RequestOptions): Promise<NetworkDevice>;
    /**
     * Get list of devices in this device's network (from config)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NetworkDevice[]>
     */
    listNetworkDevices(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<NetworkDevice[]>;
    /**
     * Get all exposed ports from devices in my network
     * @param params - Request parameters
     * @param params.network - Filter by network type
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    listNetworkExposedPorts(params: {
        orgId: string;
        deviceId: string;
        network?: 'local' | 'global';
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * Remove a device from this device's rubix network configuration
     * @param params - Request parameters
     * @param params.networkDeviceId - Network device ID to remove
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string }>
     */
    removeNetworkDevice(params: {
        orgId: string;
        deviceId: string;
        networkDeviceId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
    }>;
}
export declare class NodesClient extends BaseClient {
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/nodes/actions
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ affectedCount?: number; message?: string; nodes?: Node[] }>
     */
    actions(params: {
        orgId: string;
        deviceId: string;
        body: {
            action?: 'copy' | 'move' | 'delete' | 'duplicate-selection';
            includeChildren?: boolean;
            includeEdges?: boolean;
            nodeIds?: string[];
            offset?: {
                x?: number;
                y?: number;
            };
            targetParentId?: string;
        };
    }, opts?: RequestOptions): Promise<{
        affectedCount?: number;
        message?: string;
        nodes?: Node[];
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/nodes/batch-update
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ nodes?: Node[]; updatedCount?: number }>
     */
    batchUpdate(params: {
        orgId: string;
        deviceId: string;
        body: {
            updates?: {
                data?: Record<string, unknown>;
                id?: string;
                position?: {
                    x?: number;
                    y?: number;
                };
            }[];
        };
    }, opts?: RequestOptions): Promise<{
        nodes?: Node[];
        updatedCount?: number;
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/nodes/bulk-create
     * @param params - Request parameters
     * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
     * @param params.delete - Delete existing nodes/edges before creating
     * @param params.start - Start runtime after bulk create
     * @param params.parentId - Parent node ID. Auto-creates parentRef for all nodes. If omitted, uses orgId as parent.
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ createdCount?: number; deletedCount?: number; errors?: { index?: number; message?: string; nodeId?: string }[]; nodes?: Node[]; runtimeStarted?: boolean; skippedCount?: number }>
     */
    bulkCreate(params: {
        orgId: string;
        deviceId: string;
        allowUnknown?: boolean;
        delete?: boolean;
        start?: boolean;
        parentId?: string;
        body: BulkCreateRequest;
    }, opts?: RequestOptions): Promise<{
        createdCount?: number;
        deletedCount?: number;
        errors?: {
            index?: number;
            message?: string;
            nodeId?: string;
        }[];
        nodes?: Node[];
        runtimeStarted?: boolean;
        skippedCount?: number;
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/nodes/bulk
     * @param params - Request parameters
     * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
     * @param params.delete - Delete existing nodes/edges before creating
     * @param params.start - Start runtime after bulk create
     * @param params.parentId - Parent node ID. Auto-creates parentRef for all nodes. If omitted, uses orgId as parent.
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ createdCount?: number; deletedCount?: number; errors?: { index?: number; message?: string; nodeId?: string }[]; nodes?: Node[]; runtimeStarted?: boolean; skippedCount?: number }>
     */
    bulkCreate2(params: {
        orgId: string;
        deviceId: string;
        allowUnknown?: boolean;
        delete?: boolean;
        start?: boolean;
        parentId?: string;
        body: BulkCreateRequest;
    }, opts?: RequestOptions): Promise<{
        createdCount?: number;
        deletedCount?: number;
        errors?: {
            index?: number;
            message?: string;
            nodeId?: string;
        }[];
        nodes?: Node[];
        runtimeStarted?: boolean;
        skippedCount?: number;
    }>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/nodes/bulk
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ deletedChildren?: number; deletedCount?: number; deletedNodes?: string[]; message?: string }>
     */
    bulkDelete(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        deletedChildren?: number;
        deletedCount?: number;
        deletedNodes?: string[];
        message?: string;
    }>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/nodes/bulk
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ errors?: { message?: string; nodeId?: string }[]; nodes?: Node[]; updatedCount?: number }>
     */
    bulkUpdate(params: {
        orgId: string;
        deviceId: string;
        body: BulkUpdateNodesRequest;
    }, opts?: RequestOptions): Promise<{
        errors?: {
            message?: string;
            nodeId?: string;
        }[];
        nodes?: Node[];
        updatedCount?: number;
    }>;
    /**
     * Execute a DELETE command (delete/clear operation)
     * @param params - Request parameters
     * @param params.async - Force async execution (returns jobId instead of result)
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    commandDelete(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        commandName: string;
        async?: boolean;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Execute a GET command (query/read operation, returns data synchronously). Query parameters are passed through to the command handler (e.g., ?token=abc&duration=5000).
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Record<string, unknown>>
     */
    commandGet(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        commandName: string;
    }, opts?: RequestOptions): Promise<Record<string, unknown>>;
    /**
     * Execute a PATCH command (update operation)
     * @param params - Request parameters
     * @param params.async - Force async execution (returns jobId instead of result)
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    commandPatch(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        commandName: string;
        async?: boolean;
        body: Record<string, unknown>;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Execute a POST command (create/mutation operation)
     * @param params - Request parameters
     * @param params.async - Force async execution (returns jobId instead of result)
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    commandPost(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        commandName: string;
        async?: boolean;
        body: Record<string, unknown>;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Execute a command asynchronously (returns job ID)
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ jobId?: string }>
     */
    commandRun(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        body: {
            commandName?: string;
            parameters?: Record<string, unknown>;
        };
    }, opts?: RequestOptions): Promise<{
        jobId?: string;
    }>;
    /**
     * Execute multiple commands transactionally
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<BulkCommandResponse>
     */
    commandRunBulk(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<BulkCommandResponse>;
    /**
     * Get a specific command definition including schema
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<CommandDefinition>
     */
    commandsGet(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        name: string;
    }, opts?: RequestOptions): Promise<CommandDefinition>;
    /**
     * List commands supported by a node
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<CommandDefinition[]>
     */
    commandsList(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<CommandDefinition[]>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/nodes
     * @param params - Request parameters
     * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
     * @param params.parentId - Parent node ID. Auto-creates parentRef. If omitted, uses orgId as parent.
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        allowUnknown?: boolean;
        parentId?: string;
        body: NodeCreate;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/nodes/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/nodes
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    deleteAll(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Deploy CE nodes from Rubix database to Control Engine runtime
     * @param params - Request parameters
     * @param params.id - CE driver node ID (must be type drivers.control_engine)
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ duration?: string; edgesCreated?: number; edgesDeleted?: number; errors?: string[]; nodesCreated?: number; nodesDeleted?: number; nodesUpdated?: number; success?: boolean }>
     */
    deploy(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<{
        duration?: string;
        edgesCreated?: number;
        edgesDeleted?: number;
        errors?: string[];
        nodesCreated?: number;
        nodesDeleted?: number;
        nodesUpdated?: number;
        success?: boolean;
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nodes/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        id: string;
        includeValues?: boolean;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * Cancel/delete a command job
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; success?: boolean }>
     */
    jobsDelete(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        jobId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        success?: boolean;
    }>;
    /**
     * Get command job status and result
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<CommandJob>
     */
    jobsGet(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        jobId: string;
    }, opts?: RequestOptions): Promise<CommandJob>;
    /**
     * List command jobs for a node
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<CommandJob[]>
     */
    jobsList(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        status?: 'pending' | 'running' | 'success' | 'failed';
    }, opts?: RequestOptions): Promise<CommandJob[]>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nodes
     * @param params - Request parameters
     * @param params.type - Filter by node type (e.g., trigger.timer, core.counter)
     * @param params.tags - Additional tag filters as JSON
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NodeListResponse>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        type?: string;
        tags?: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<NodeListResponse>;
    /**
     * Fast-path update for UI-only metadata (name, position, tags, data, ui) without stopping node processing
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    metadataUpdate(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: {
            data?: Record<string, unknown>;
            name?: string;
            position?: {
                x?: number;
                y?: number;
            };
            tags?: string[];
            ui?: Record<string, unknown>;
        };
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * Get single port metadata (definition) - no value included
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ description?: string; handle?: string; id?: string; kind?: string; name?: string; type?: string }>
     */
    portGet(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portId: string;
    }, opts?: RequestOptions): Promise<{
        description?: string;
        handle?: string;
        id?: string;
        kind?: string;
        name?: string;
        type?: string;
    }>;
    /**
     * Clear single port runtime value
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; success?: boolean }>
     */
    portValueClear(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        success?: boolean;
    }>;
    /**
     * Get single port runtime value
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ timestamp?: string; type?: string; value?: any }>
     */
    portValueGet(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portId: string;
    }, opts?: RequestOptions): Promise<{
        timestamp?: string;
        type?: string;
        value?: any;
    }>;
    /**
     * Set single port runtime value. Use ?setOutput=true to write directly to output ports using SetOutputPortValue (bypasses processing, useful for polling nodes updating entity ports).
     * @param params - Request parameters
     * @param params.setOutput - If true, uses SetOutputPortValue for direct output port write (bypasses processing). If false, uses EmitValue (normal flow processing).
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ method?: string; nodeId?: string; portId?: string; success?: boolean; timestamp?: string; value?: any }>
     */
    portValueSet(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portId: string;
        setOutput?: boolean;
        body: {
            dataType?: string;
            value?: any;
        };
    }, opts?: RequestOptions): Promise<{
        method?: string;
        nodeId?: string;
        portId?: string;
        success?: boolean;
        timestamp?: string;
        value?: any;
    }>;
    /**
     * Get all port values for a node (inputs and outputs)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NodePortValuesResponse>
     */
    portValuesList(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<NodePortValuesResponse>;
    /**
     * Get all port metadata (definitions) for a node - no values included
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ inputs?: { description?: string; disablePort?: boolean; enumId?: string; handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; id?: string; isOverridden?: boolean; kind?: string; name?: string; nodeId?: string; quantity?: string; required?: boolean; type?: string; unit?: string }[]; nodeId?: string; outputs?: { description?: string; disablePort?: boolean; enumId?: string; handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; id?: string; isOverridden?: boolean; kind?: string; name?: string; nodeId?: string; quantity?: string; required?: boolean; type?: string; unit?: string }[] }>
     */
    portsList(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<{
        inputs?: {
            description?: string;
            disablePort?: boolean;
            enumId?: string;
            handle?: string;
            historyEnabled?: boolean;
            historyInterval?: number;
            historyPolicy?: string;
            historyThreshold?: number;
            id?: string;
            isOverridden?: boolean;
            kind?: string;
            name?: string;
            nodeId?: string;
            quantity?: string;
            required?: boolean;
            type?: string;
            unit?: string;
        }[];
        nodeId?: string;
        outputs?: {
            description?: string;
            disablePort?: boolean;
            enumId?: string;
            handle?: string;
            historyEnabled?: boolean;
            historyInterval?: number;
            historyPolicy?: string;
            historyThreshold?: number;
            id?: string;
            isOverridden?: boolean;
            kind?: string;
            name?: string;
            nodeId?: string;
            quantity?: string;
            required?: boolean;
            type?: string;
            unit?: string;
        }[];
    }>;
    /**
     * Get node settings (current values only)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ settings?: Record<string, unknown> }>
     */
    settings(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<{
        settings?: Record<string, unknown>;
    }>;
    /**
     * PATCH /orgs/{orgId}/devices/{deviceId}/nodes/{id}/settings
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ node?: Node; settings?: Record<string, unknown> }>
     */
    settingsPatch(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: Record<string, unknown>;
    }, opts?: RequestOptions): Promise<{
        node?: Node;
        settings?: Record<string, unknown>;
    }>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/nodes/{id}/settings
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ node?: Node; settings?: Record<string, unknown> }>
     */
    settingsUpdate(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: Record<string, unknown>;
    }, opts?: RequestOptions): Promise<{
        node?: Node;
        settings?: Record<string, unknown>;
    }>;
    /**
     * Get node settings schema combined with current values (optimized for settings UI)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NodeSettingsSchemaResponse>
     */
    settingsWithSchema(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<NodeSettingsSchemaResponse>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/nodes/{id}/trigger
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    trigger(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/nodes/{id}
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: NodeUpdate;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * Update a node's ID and all references to it (refs and edges). Atomic operation.
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; newNodeId?: string; node?: Node; oldNodeId?: string; success?: boolean }>
     */
    updateId(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: {
            newNodeId?: string;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        newNodeId?: string;
        node?: Node;
        oldNodeId?: string;
        success?: boolean;
    }>;
}
export declare class NodesHierarchyClient extends BaseClient {
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/ancestors
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node[]>
     */
    getancestors(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<Node[]>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/children
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node[]>
     */
    getchildren(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<Node[]>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/descendants
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node[]>
     */
    getdescendants(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<Node[]>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/family
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ children?: Node[]; parent?: Node }>
     */
    getfamily(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<{
        children?: Node[];
        parent?: Node;
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/parent
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    getparent(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tree
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ children?: Node[]; root?: Node }>
     */
    gettree(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<{
        children?: Node[];
        root?: Node;
    }>;
}
export declare class NodesPagesClient extends BaseClient {
    /**
     * Attach a page to a node via pageRef
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: { default?: boolean; nodeId?: string; order?: number; pageId?: string; refId?: string }; message?: string }>
     */
    attach(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<{
        data?: {
            default?: boolean;
            nodeId?: string;
            order?: number;
            pageId?: string;
            refId?: string;
        };
        message?: string;
    }>;
    /**
     * Detach a page from a node (delete pageRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    detach(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * List all available pages for a node (pallet + custom via pageRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: { description?: string; icon?: string; isDefault?: boolean; nodeId?: string; order?: number; pageId?: string; route?: string; source?: string; title?: string }[]; meta?: { count?: number; nodeId?: string; nodeType?: string } }>
     */
    getNodePages(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<{
        data?: {
            description?: string;
            icon?: string;
            isDefault?: boolean;
            nodeId?: string;
            order?: number;
            pageId?: string;
            route?: string;
            source?: string;
            title?: string;
        }[];
        meta?: {
            count?: number;
            nodeId?: string;
            nodeType?: string;
        };
    }>;
    /**
     * Resolve a page configuration with context
     * @param params - Request parameters
     * @param params.nodeId - Context node ID for resolution
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ context?: Record<string, unknown>; icon?: string; pageId?: string; route?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { config?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { config?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }>
     */
    resolve(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
        nodeId?: string;
    }, opts?: RequestOptions): Promise<{
        context?: Record<string, unknown>;
        icon?: string;
        pageId?: string;
        route?: string;
        templates?: {
            config?: Record<string, unknown>;
            layoutType?: string;
            templateId?: string;
            widgets?: {
                config?: Record<string, unknown>;
                order?: number;
                title?: string;
                widgetId?: string;
                widgetType?: string;
                zone?: string;
            }[];
            zones?: string[];
        }[];
        title?: string;
        widgets?: {
            config?: Record<string, unknown>;
            order?: number;
            title?: string;
            widgetId?: string;
            widgetType?: string;
            zone?: string;
        }[];
    }>;
}
export declare class NodesPagesAttachClient extends BaseClient {
    /**
     * Attach a page to a node via pageRef
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ isDefault?: boolean; message?: string; nodeId?: string; order?: number; pageId?: string; refId?: string }>
     */
    attach(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        pageId: string;
        body: {
            isDefault?: boolean;
            metadata?: Record<string, unknown>;
            order?: number;
        };
    }, opts?: RequestOptions): Promise<{
        isDefault?: boolean;
        message?: string;
        nodeId?: string;
        order?: number;
        pageId?: string;
        refId?: string;
    }>;
    /**
     * Detach a page from a node (delete pageRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; nodeId?: string; pageId?: string }>
     */
    detach(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        nodeId?: string;
        pageId?: string;
    }>;
}
export declare class NodesRelationshipsClient extends BaseClient {
    /**
     * Get all relationships for a node (pages, widgets, parent, children, etc.)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ nodeId?: string; nodeName?: string; nodeType?: string; relationships?: Record<string, unknown> }>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<{
        nodeId?: string;
        nodeName?: string;
        nodeType?: string;
        relationships?: Record<string, unknown>;
    }>;
}
export declare class NodesValidateRelationshipsClient extends BaseClient {
    /**
     * Validate all relationships for a node
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }>
     */
    validate(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<{
        errors?: unknown[];
        valid?: boolean;
        warnings?: unknown[];
    }>;
}
export declare class OrgAdminClient extends BaseClient {
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/admin/devices/{nodeId}/approve
     * @param params - Request parameters
     * @param params.nodeId - Node ID of the discovered device
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; nodeId?: string; success?: boolean }>
     */
    approveDevice(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        body: {
            approvalReason?: string;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        nodeId?: string;
        success?: boolean;
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/admin/blacklist
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ blacklistId?: string; message?: string; success?: boolean }>
     */
    blacklistDevice(params: {
        orgId: string;
        deviceId: string;
        body: {
            description?: string;
            reason?: string;
            revokeExistingAccess?: boolean;
            serialNumber?: string;
        };
    }, opts?: RequestOptions): Promise<{
        blacklistId?: string;
        message?: string;
        success?: boolean;
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/admin/orgs
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ flowId?: string; message?: string; name?: string; orgId?: string; success?: boolean }>
     */
    createOrg(params: {
        orgId: string;
        deviceId: string;
        body: AdminOrgCreate;
    }, opts?: RequestOptions): Promise<{
        flowId?: string;
        message?: string;
        name?: string;
        orgId?: string;
        success?: boolean;
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/admin/devices/{nodeId}/deny
     * @param params - Request parameters
     * @param params.nodeId - Node ID of the discovered device
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; nodeId?: string; success?: boolean }>
     */
    denyDevice(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        body: {
            denialReason?: string;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        nodeId?: string;
        success?: boolean;
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/admin/devices/discover
     * @param params - Request parameters
     * @param params.deviceObjectIdRange - Range filter (e.g., '1-100' or '-1' for all)
     * @param params.timeout - Discovery timeout in seconds
     * @param params.add - Auto-provision: create device nodes and add to 'main' flow
     * @param params.type - Network type: 'global' or 'local' (used to find rubix.network node automatically)
     * @param params.rubixNetworkNodeId - Rubix network node ID for creating network ref (optional if type is provided)
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ devices?: DiscoveredDevice[]; devicesAdded?: number; devicesFound?: number; flowId?: string; message?: string; networkNodeId?: string; success?: boolean }>
     */
    discoverDevices(params: {
        orgId: string;
        deviceId: string;
        deviceObjectIdRange?: string;
        timeout?: number;
        add?: boolean;
        type?: string;
        rubixNetworkNodeId?: string;
    }, opts?: RequestOptions): Promise<{
        devices?: DiscoveredDevice[];
        devicesAdded?: number;
        devicesFound?: number;
        flowId?: string;
        message?: string;
        networkNodeId?: string;
        success?: boolean;
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/admin/config/connection
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ deviceRole?: string; natsGlobalUrl?: string; natsLocalUrl?: string; sources?: { natsGlobalUrl?: string; natsLocalUrl?: string }; supervisorDeviceId?: string; supervisorOrgId?: string }>
     */
    getConnectionConfig(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        deviceRole?: string;
        natsGlobalUrl?: string;
        natsLocalUrl?: string;
        sources?: {
            natsGlobalUrl?: string;
            natsLocalUrl?: string;
        };
        supervisorDeviceId?: string;
        supervisorOrgId?: string;
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/admin/config
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ deviceObjectId?: number; hardwareModel?: string; hardwareVersion?: string; id?: string; orgId?: string; role?: string; runLocalServer?: boolean; serialNumber?: string }>
     */
    getDeviceConfig(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        deviceObjectId?: number;
        hardwareModel?: string;
        hardwareVersion?: string;
        id?: string;
        orgId?: string;
        role?: string;
        runLocalServer?: boolean;
        serialNumber?: string;
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/admin/info
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ assignment?: { deviceId?: string; orgId?: string }; hardware?: { deviceObjectId?: number; model?: string; serialNumber?: string; version?: string }; software?: { role?: string; runLocalServer?: boolean } }>
     */
    getDeviceInfo(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        assignment?: {
            deviceId?: string;
            orgId?: string;
        };
        hardware?: {
            deviceObjectId?: number;
            model?: string;
            serialNumber?: string;
            version?: string;
        };
        software?: {
            role?: string;
            runLocalServer?: boolean;
        };
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/admin/blacklist
     * @param params - Request parameters
     * @param params.activeOnly - Only show active blacklist entries
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: DeviceBlacklist[]; meta?: { limit?: number; offset?: number; total?: number } }>
     */
    listBlacklist(params: {
        orgId: string;
        deviceId: string;
        activeOnly?: boolean;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<{
        data?: DeviceBlacklist[];
        meta?: {
            limit?: number;
            offset?: number;
            total?: number;
        };
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/admin/devices/discovered
     * @param params - Request parameters
     * @param params.status - Filter by status: discovered, approved, denied, provisioned, or empty for all
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: DiscoveredDevice[]; meta?: { total?: number } }>
     */
    listDiscovered(params: {
        orgId: string;
        deviceId: string;
        status?: string;
    }, opts?: RequestOptions): Promise<{
        data?: DiscoveredDevice[];
        meta?: {
            total?: number;
        };
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/admin/orgs
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ orgs?: { createdAt?: string; description?: string; flowId?: string; id?: string; name?: string; orgId?: string; status?: string; updatedAt?: string }[]; total?: number }>
     */
    listOrgs(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        orgs?: {
            createdAt?: string;
            description?: string;
            flowId?: string;
            id?: string;
            name?: string;
            orgId?: string;
            status?: string;
            updatedAt?: string;
        }[];
        total?: number;
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/admin/devices/provisioned
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node[]; meta?: { total?: number } }>
     */
    listProvisioned(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        data?: Node[];
        meta?: {
            total?: number;
        };
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/admin/devices/provision
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<ProvisionResponse>
     */
    provisionDevice(params: {
        orgId: string;
        deviceId: string;
        body: ProvisionRequest;
    }, opts?: RequestOptions): Promise<ProvisionResponse>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/admin/blacklist/{blacklistId}
     * @param params - Request parameters
     * @param params.blacklistId - Blacklist entry ID to remove
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; success?: boolean }>
     */
    removeFromBlacklist(params: {
        orgId: string;
        deviceId: string;
        blacklistId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        success?: boolean;
    }>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/admin/devices/{serialNumber}/unprovision
     * @param params - Request parameters
     * @param params.serialNumber - Serial number of device to unprovision
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    unprovisionDevice(params: {
        orgId: string;
        deviceId: string;
        serialNumber: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * PATCH /orgs/{orgId}/devices/{deviceId}/admin/config/connection
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; success?: boolean }>
     */
    updateConnectionConfig(params: {
        orgId: string;
        deviceId: string;
        body: {
            deviceRole?: 'supervisor-device' | 'gateway-device' | 'field-device';
            natsGlobalUrl?: string;
            natsLocalUrl?: string;
            supervisorDeviceId?: string;
            supervisorOrgId?: string;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        success?: boolean;
    }>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/admin/config/role
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; role?: string; success?: boolean }>
     */
    updateDeviceRole(params: {
        orgId: string;
        deviceId: string;
        body: {
            role?: 'supervisor-device' | 'field-device' | 'gateway-device';
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        role?: string;
        success?: boolean;
    }>;
}
export declare class OrgsClient extends BaseClient {
    /**
     * POST /orgs
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    create(params: {
        body: OrgCreate;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * DELETE /orgs/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    delete(params: {
        id: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * GET /orgs/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    get(params: {
        id: string;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * Get organization favicon (returns image file)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    getFavicon(params: {
        orgId: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * Get comprehensive organization information including root device, networks, and devices
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<OrgInfo>
     */
    getInfo(params: {
        id: string;
    }, opts?: RequestOptions): Promise<OrgInfo>;
    /**
     * Get organization logo (returns image file)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    getLogo(params: {
        orgId: string;
        variant?: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * GET /orgs
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node[]; meta?: { total?: number } }>
     */
    list(params: {}, opts?: RequestOptions): Promise<{
        data?: Node[];
        meta?: {
            total?: number;
        };
    }>;
    /**
     * PUT /orgs/{id}
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<Node>
     */
    update(params: {
        id: string;
        body: OrgUpdate;
    }, opts?: RequestOptions): Promise<Node>;
    /**
     * Upload organization logo
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    uploadLogo(params: {
        orgId: string;
        body: {
            logoBase64?: string;
            variant?: string;
        };
    }, opts?: RequestOptions): Promise<MessageResponse>;
}
export declare class PagesClient extends BaseClient {
    /**
     * Attach a tab to a page via tabRef
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: { order?: number; pageId?: string; refId?: string; tabId?: string }; message?: string }>
     */
    attachTab(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
        tabId: string;
        body: {
            isActive?: boolean;
            order?: number;
        };
    }, opts?: RequestOptions): Promise<{
        data?: {
            order?: number;
            pageId?: string;
            refId?: string;
            tabId?: string;
        };
        message?: string;
    }>;
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/pages
     * @param params - Request parameters
     * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node }>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        allowUnknown?: boolean;
        body: NodeCreate;
    }, opts?: RequestOptions): Promise<{
        data?: Node;
    }>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/pages/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; pageId?: string }>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        pageId?: string;
    }>;
    /**
     * Detach a tab from a page (delete tabRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    detachTab(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
        tabId: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/pages/{id}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node }>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<{
        data?: Node;
    }>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/pages
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node[]; meta?: { total?: number } }>
     */
    list(params: {
        orgId?: string;
        deviceId?: string;
    }, opts?: RequestOptions): Promise<{
        data?: Node[];
        meta?: {
            total?: number;
        };
    }>;
    /**
     * List all tabs attached to a page via tabRef
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: { icon?: string; isActive?: boolean; order?: number; refId?: string; tabId?: string; tabName?: string; title?: string }[]; meta?: { count?: number; pageId?: string } }>
     */
    listPageTabs(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<{
        data?: {
            icon?: string;
            isActive?: boolean;
            order?: number;
            refId?: string;
            tabId?: string;
            tabName?: string;
            title?: string;
        }[];
        meta?: {
            count?: number;
            pageId?: string;
        };
    }>;
    /**
     * Resolve a complete page configuration with all templates and widgets. Supports context substitution via query params.
     * @param params - Request parameters
     * @param params.context - Context variables for resolution (?context[key]=value or ?nodeId=value)
     * @param params.resolveWidgets - If true, fully resolves all widgets with their data (haystack query results + runtime values). If false (default), returns only widget metadata.
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ context?: Record<string, unknown>; icon?: string; pageId?: string; route?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }>
     */
    resolve(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
        context?: Record<string, unknown>;
        resolveWidgets?: boolean;
    }, opts?: RequestOptions): Promise<{
        context?: Record<string, unknown>;
        icon?: string;
        pageId?: string;
        route?: string;
        templates?: {
            config?: Record<string, unknown>;
            layoutType?: string;
            templateId?: string;
            widgets?: {
                component?: string;
                config?: Record<string, unknown>;
                data?: Record<string, unknown>[];
                dataCount?: number;
                description?: string;
                name?: string;
                nodeData?: Record<string, unknown>;
                order?: number;
                query?: string;
                queryRuntime?: boolean;
                size?: string;
                source?: string;
                title?: string;
                widgetId?: string;
                widgetType?: string;
                zone?: string;
            }[];
            zones?: string[];
        }[];
        title?: string;
        widgets?: {
            component?: string;
            config?: Record<string, unknown>;
            data?: Record<string, unknown>[];
            dataCount?: number;
            description?: string;
            name?: string;
            nodeData?: Record<string, unknown>;
            order?: number;
            query?: string;
            queryRuntime?: boolean;
            size?: string;
            source?: string;
            title?: string;
            widgetId?: string;
            widgetType?: string;
            zone?: string;
        }[];
    }>;
    /**
     * Resolve a complete page configuration with all templates and widgets. Supports context substitution via JSON body.
     * @param params - Request parameters
     * @param params.resolveWidgets - If true, fully resolves all widgets with their data (haystack query results + runtime values). If false (default), returns only widget metadata.
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ context?: Record<string, unknown>; icon?: string; pageId?: string; route?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }>
     */
    resolvePost(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
        resolveWidgets?: boolean;
        body: {
            context?: Record<string, unknown>;
        };
    }, opts?: RequestOptions): Promise<{
        context?: Record<string, unknown>;
        icon?: string;
        pageId?: string;
        route?: string;
        templates?: {
            config?: Record<string, unknown>;
            layoutType?: string;
            templateId?: string;
            widgets?: {
                component?: string;
                config?: Record<string, unknown>;
                data?: Record<string, unknown>[];
                dataCount?: number;
                description?: string;
                name?: string;
                nodeData?: Record<string, unknown>;
                order?: number;
                query?: string;
                queryRuntime?: boolean;
                size?: string;
                source?: string;
                title?: string;
                widgetId?: string;
                widgetType?: string;
                zone?: string;
            }[];
            zones?: string[];
        }[];
        title?: string;
        widgets?: {
            component?: string;
            config?: Record<string, unknown>;
            data?: Record<string, unknown>[];
            dataCount?: number;
            description?: string;
            name?: string;
            nodeData?: Record<string, unknown>;
            order?: number;
            query?: string;
            queryRuntime?: boolean;
            size?: string;
            source?: string;
            title?: string;
            widgetId?: string;
            widgetType?: string;
            zone?: string;
        }[];
    }>;
    /**
     * Resolve a complete tab configuration with all templates and widgets. Supports context substitution via JSON body.
     * @param params - Request parameters
     * @param params.resolveWidgets - If true, fully resolves all widgets with their data (haystack query results + runtime values). If false (default), returns only widget metadata.
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ context?: Record<string, unknown>; icon?: string; isActive?: boolean; order?: number; tabId?: string; tabName?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { config?: Record<string, unknown>; nodeData?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { config?: Record<string, unknown>; nodeData?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }>
     */
    resolveTabPost(params: {
        orgId: string;
        deviceId: string;
        tabId: string;
        resolveWidgets?: boolean;
        body: {
            context?: Record<string, unknown>;
        };
    }, opts?: RequestOptions): Promise<{
        context?: Record<string, unknown>;
        icon?: string;
        isActive?: boolean;
        order?: number;
        tabId?: string;
        tabName?: string;
        templates?: {
            config?: Record<string, unknown>;
            layoutType?: string;
            templateId?: string;
            widgets?: {
                config?: Record<string, unknown>;
                nodeData?: Record<string, unknown>;
                order?: number;
                title?: string;
                widgetId?: string;
                widgetType?: string;
                zone?: string;
            }[];
            zones?: string[];
        }[];
        title?: string;
        widgets?: {
            config?: Record<string, unknown>;
            nodeData?: Record<string, unknown>;
            order?: number;
            title?: string;
            widgetId?: string;
            widgetType?: string;
            zone?: string;
        }[];
    }>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/pages/{id}
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node }>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: NodeUpdate;
    }, opts?: RequestOptions): Promise<{
        data?: Node;
    }>;
    /**
     * Validate a page configuration for errors (e.g., circular references, missing widgets)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ errors?: { code?: string; field?: string; message?: string }[]; valid?: boolean }>
     */
    validate(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<{
        errors?: {
            code?: string;
            field?: string;
            message?: string;
        }[];
        valid?: boolean;
    }>;
}
export declare class PagesStructureClient extends BaseClient {
    /**
     * Get complete page structure (templates + widgets)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ page?: PageStructureNode; templates?: PageStructureNode[]; widgets?: PageStructureNode[] }>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<{
        page?: PageStructureNode;
        templates?: PageStructureNode[];
        widgets?: PageStructureNode[];
    }>;
}
export declare class PagesTemplatesAttachClient extends BaseClient {
    /**
     * Attach a template to a page via templateRef
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; order?: number; pageId?: string; refId?: string; templateId?: string }>
     */
    attach(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
        templateId: string;
        body: {
            order?: number;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        order?: number;
        pageId?: string;
        refId?: string;
        templateId?: string;
    }>;
    /**
     * Detach a template from a page (delete templateRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; pageId?: string; templateId?: string }>
     */
    detach(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
        templateId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        pageId?: string;
        templateId?: string;
    }>;
    /**
     * List all templates attached to a page
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ count?: number; pageId?: string; templates?: Record<string, unknown>[] }>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<{
        count?: number;
        pageId?: string;
        templates?: Record<string, unknown>[];
    }>;
}
export declare class PagesUsageClient extends BaseClient {
    /**
     * Find all nodes that use this page
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ resourceId?: string; resourceName?: string; resourceType?: string; usageCount?: number; usedBy?: unknown[] }>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<{
        resourceId?: string;
        resourceName?: string;
        resourceType?: string;
        usageCount?: number;
        usedBy?: unknown[];
    }>;
}
export declare class PagesValidateClient extends BaseClient {
    /**
     * Validate a page configuration (check for broken refs, circular deps)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }>
     */
    validate(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<{
        errors?: unknown[];
        valid?: boolean;
        warnings?: unknown[];
    }>;
}
export declare class PagesWidgetsAttachClient extends BaseClient {
    /**
     * Attach a widget to a page via widgetRef
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; order?: number; pageId?: string; refId?: string; slot?: string; widgetId?: string }>
     */
    attach(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
        widgetId: string;
        body: {
            order?: number;
            overrides?: Record<string, unknown>;
            slot?: string;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        order?: number;
        pageId?: string;
        refId?: string;
        slot?: string;
        widgetId?: string;
    }>;
    /**
     * Detach a widget from a page (delete widgetRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; pageId?: string; widgetId?: string }>
     */
    detach(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
        widgetId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        pageId?: string;
        widgetId?: string;
    }>;
    /**
     * List all widgets attached to a page
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ count?: number; pageId?: string; widgets?: Record<string, unknown>[] }>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
    }, opts?: RequestOptions): Promise<{
        count?: number;
        pageId?: string;
        widgets?: Record<string, unknown>[];
    }>;
    /**
     * Update the order of a widget within a page
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; order?: number; pageId?: string; widgetId?: string }>
     */
    reorder(params: {
        orgId: string;
        deviceId: string;
        pageId: string;
        widgetId: string;
        body: {
            order?: number;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        order?: number;
        pageId?: string;
        widgetId?: string;
    }>;
}
export declare class PalletClient extends BaseClient {
    /**
     * Get detailed information about a specific node type including its ports and settings
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        nodeType: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get all available node types that can be created
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    list(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class PingClient extends BaseClient {
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/ping
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    status(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class PluginsClient extends BaseClient {
    /**
     * Get plugin metadata
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<PluginMetadata>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        pluginId: string;
    }, opts?: RequestOptions): Promise<PluginMetadata>;
    /**
     * List all discovered plugins with runtime status and stats
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<PluginListResponse>
     */
    list(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<PluginListResponse>;
    /**
     * Ping plugin to check if it's alive and responsive via NATS RPC
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ details?: { nodeId?: string; status?: string; version?: string }; error?: string; nodeId?: string; status?: string; success?: boolean; version?: string }>
     */
    ping(params: {
        orgId: string;
        deviceId: string;
        pluginId: string;
    }, opts?: RequestOptions): Promise<{
        details?: {
            nodeId?: string;
            status?: string;
            version?: string;
        };
        error?: string;
        nodeId?: string;
        status?: string;
        success?: boolean;
        version?: string;
    }>;
    /**
     * Start plugin process
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; pluginId?: string; status?: string }>
     */
    start(params: {
        orgId: string;
        deviceId: string;
        pluginId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        pluginId?: string;
        status?: string;
    }>;
    /**
     * Get plugin runtime status (instance info)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<PluginInstance>
     */
    status(params: {
        orgId: string;
        deviceId: string;
        pluginId: string;
    }, opts?: RequestOptions): Promise<PluginInstance>;
    /**
     * Stop plugin process
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; pluginId?: string; status?: string }>
     */
    stop(params: {
        orgId: string;
        deviceId: string;
        pluginId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        pluginId?: string;
        status?: string;
    }>;
}
export declare class PortMappingsClient extends BaseClient {
    /**
     * Disable a port mapping (stops publishing)
     * @param params - Request parameters
     * @param params.mappingId - Port mapping ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string }>
     */
    disableMapping(params: {
        orgId: string;
        deviceId: string;
        mappingId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
    }>;
    /**
     * Enable a disabled port mapping
     * @param params - Request parameters
     * @param params.mappingId - Port mapping ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string }>
     */
    enableMapping(params: {
        orgId: string;
        deviceId: string;
        mappingId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
    }>;
    /**
     * Expose a port to NATS network (local or global)
     * @param params - Request parameters
     * @param params.portId - Port ID (format nodeId-portHandle, e.g., "sensor-1-temperature")
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<PortMapping>
     */
    exposePort(params: {
        orgId: string;
        deviceId: string;
        portId: string;
        body: {
            description?: string;
            fallbackValue?: any;
            fallbackValueType?: string;
            name?: string;
            network?: 'local' | 'global';
            tags?: string[];
        };
    }, opts?: RequestOptions): Promise<PortMapping>;
    /**
     * Get a specific port mapping by ID
     * @param params - Request parameters
     * @param params.mappingId - Port mapping ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<PortMapping>
     */
    getPortMapping(params: {
        orgId: string;
        deviceId: string;
        mappingId: string;
    }, opts?: RequestOptions): Promise<PortMapping>;
    /**
     * List all exposed ports across all devices in org (for discovery)
     * @param params - Request parameters
     * @param params.network - Optional filter by network type
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<PortMapping[]>
     */
    listExposedPorts(params: {
        orgId: string;
        network?: 'local' | 'global';
    }, opts?: RequestOptions): Promise<PortMapping[]>;
    /**
     * List all port mappings (exposed ports) for a device
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<PortMapping[]>
     */
    listPortMappings(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<PortMapping[]>;
    /**
     * List all port subscriptions for a device
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<PortSubscription[]>
     */
    listPortSubscriptions(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<PortSubscription[]>;
    /**
     * Subscribe a port to an exposed port (receive NATS messages)
     * @param params - Request parameters
     * @param params.portId - Target port ID (format nodeId-portHandle)
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<PortSubscription>
     */
    subscribeToPort(params: {
        orgId: string;
        deviceId: string;
        portId: string;
        body: {
            mappingId?: string;
            network?: 'local' | 'global';
            subscriberDeviceId?: string;
            subscriberNodeId?: string;
            subscriberPortId?: string;
        };
    }, opts?: RequestOptions): Promise<PortSubscription>;
    /**
     * Remove port exposure (stop publishing to NATS)
     * @param params - Request parameters
     * @param params.mappingId - Port mapping ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string }>
     */
    unexposePort(params: {
        orgId: string;
        deviceId: string;
        mappingId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
    }>;
    /**
     * Unsubscribe from an exposed port (stop receiving messages)
     * @param params - Request parameters
     * @param params.subscriptionId - Port subscription ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string }>
     */
    unsubscribeFromPort(params: {
        orgId: string;
        deviceId: string;
        subscriptionId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
    }>;
    /**
     * Update port mapping settings (name, description, tags, fallback)
     * @param params - Request parameters
     * @param params.mappingId - Port mapping ID
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string }>
     */
    updateMapping(params: {
        orgId: string;
        deviceId: string;
        mappingId: string;
        body: {
            description?: string;
            fallbackValue?: any;
            fallbackValueType?: string;
            name?: string;
            tags?: string[];
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
    }>;
}
export declare class PortsClient extends BaseClient {
    /**
     * Clear the override for a port
     * @param params - Request parameters
     * @param params.nodeId - Node ID
     * @param params.portHandle - Port handle (e.g., "out", "in", "increment")
     * @param params.cancelJob - Cancel timeout job if exists
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ port?: { id?: string; isOverridden?: boolean }; success?: boolean }>
     */
    clearOverride(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portHandle: string;
        cancelJob?: boolean;
    }, opts?: RequestOptions): Promise<{
        port?: {
            id?: string;
            isOverridden?: boolean;
        };
        success?: boolean;
    }>;
    /**
     * Disable a port
     * @param params - Request parameters
     * @param params.nodeId - Node ID
     * @param params.portHandle - Port handle (e.g., "out", "in", "increment")
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ port?: { disablePort?: boolean; id?: string }; success?: boolean }>
     */
    disable(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portHandle: string;
    }, opts?: RequestOptions): Promise<{
        port?: {
            disablePort?: boolean;
            id?: string;
        };
        success?: boolean;
    }>;
    /**
     * Enable a port
     * @param params - Request parameters
     * @param params.nodeId - Node ID
     * @param params.portHandle - Port handle (e.g., "out", "in", "increment")
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ port?: { disablePort?: boolean; id?: string }; success?: boolean }>
     */
    enable(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portHandle: string;
    }, opts?: RequestOptions): Promise<{
        port?: {
            disablePort?: boolean;
            id?: string;
        };
        success?: boolean;
    }>;
    /**
     * Get the override status for a port
     * @param params - Request parameters
     * @param params.nodeId - Node ID
     * @param params.portHandle - Port handle (e.g., "out", "in", "increment")
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ isDisabled?: boolean; isOverridden?: boolean; jobId?: string; jobStatus?: { enabled?: boolean; nextRunTime?: string }; overrideTimeout?: string; overrideValue?: any; timeRemaining?: string }>
     */
    getOverrideStatus(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portHandle: string;
    }, opts?: RequestOptions): Promise<{
        isDisabled?: boolean;
        isOverridden?: boolean;
        jobId?: string;
        jobStatus?: {
            enabled?: boolean;
            nextRunTime?: string;
        };
        overrideTimeout?: string;
        overrideValue?: any;
        timeRemaining?: string;
    }>;
    /**
     * Get all ports with complete status (metadata, values, override info, and history settings)
     * @param params - Request parameters
     * @param params.nodeId - Node ID
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<PortsWithStatusResponse>
     */
    listWithStatus(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<PortsWithStatusResponse>;
    /**
     * Set an override value for a port with optional timeout
     * @param params - Request parameters
     * @param params.nodeId - Node ID
     * @param params.portHandle - Port handle (e.g., "out", "in", "increment")
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ port?: { id?: string; isOverridden?: boolean; jobId?: string; overrideTimeout?: string; overrideValue?: any }; success?: boolean }>
     */
    setOverride(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        portHandle: string;
        body: {
            timeout?: string;
            timeoutAt?: string;
            value?: any;
        };
    }, opts?: RequestOptions): Promise<{
        port?: {
            id?: string;
            isOverridden?: boolean;
            jobId?: string;
            overrideTimeout?: string;
            overrideValue?: any;
        };
        success?: boolean;
    }>;
}
export declare class PublicDeviceClient extends BaseClient {
    /**
     * GET /public/health
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ service?: string; status?: string; timestamp?: string }>
     */
    health(params: {}, opts?: RequestOptions): Promise<{
        service?: string;
        status?: string;
        timestamp?: string;
    }>;
    /**
     * POST /public/device/register
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ instructions?: { nextSteps?: string[] }; message?: string; nodeId?: string; status?: string; success?: boolean; supervisor?: { discoveryTopic?: string; natsURL?: string } }>
     */
    register(params: {
        body: {
            deviceObjectId?: number;
            firmware?: string;
            hardwareModel?: string;
            hardwareVersion?: string;
            name?: string;
            role?: 'supervisor-device' | 'field-device' | 'gateway-device';
            serialNumber?: string;
        };
    }, opts?: RequestOptions): Promise<{
        instructions?: {
            nextSteps?: string[];
        };
        message?: string;
        nodeId?: string;
        status?: string;
        success?: boolean;
        supervisor?: {
            discoveryTopic?: string;
            natsURL?: string;
        };
    }>;
    /**
     * GET /public/device/status/{serialNumber}
     * @param params - Request parameters
     * @param params.serialNumber - Device serial number to check status
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ approvalReason?: string; denialReason?: string; deviceId?: string; flowId?: string; nodeId?: string; orgId?: string; serialNumber?: string; status?: string }>
     */
    status(params: {
        serialNumber: string;
    }, opts?: RequestOptions): Promise<{
        approvalReason?: string;
        denialReason?: string;
        deviceId?: string;
        flowId?: string;
        nodeId?: string;
        orgId?: string;
        serialNumber?: string;
        status?: string;
    }>;
}
export declare class QueryClient extends BaseClient {
    /**
     * Execute a Haystack filter query with optional port value projection.
  
  Supports three ways to specify port selection:
  1. Query syntax: "type is device | select out, in1" (Feature 1: Parser projection)
  2. Request body: {"filter": "...", "ports": ["out", "in1"]} (Feature 3: API parameter)
  3. Both - query projection takes precedence
  
  When ports are specified, each matching node will include a 'portValues' map
  containing the live runtime values for those ports.
  
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        body: {
            filter?: string;
            limit?: number;
            offset?: number;
            ports?: string[];
            runtime?: boolean;
        };
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Execute a Haystack filter query with optional port value projection.
  For complex queries with ports, prefer POST method.
  
     * @param params - Request parameters
     * @param params.filter - Haystack filter query with optional port projection.
  Examples: 'temp and sensor', 'type is device | select out'
  
     * @param params.runtime - Query runtime (true) or database (false)
     * @param params.ports - Comma-separated port handles to include (e.g., 'out,in1,in2')
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    filter(params: {
        orgId: string;
        deviceId: string;
        filter: string;
        runtime?: boolean;
        limit?: number;
        offset?: number;
        ports?: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Query historical port values using Haystack filter with flexible date range support
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ nodes?: { nodeId?: string; nodeName?: string; portHandle?: string; samples?: { timestamp?: string; valueBool?: boolean; valueNum?: number; valueStr?: string }[] }[]; totalNodes?: number; totalSamples?: number }>
     */
    history(params: {
        orgId: string;
        deviceId: string;
        body: {
            filter?: string;
            from?: string;
            limit?: number;
            portHandle?: string;
            range?: string;
            timeRange?: string;
            timezone?: string;
            to?: string;
        };
    }, opts?: RequestOptions): Promise<{
        nodes?: {
            nodeId?: string;
            nodeName?: string;
            portHandle?: string;
            samples?: {
                timestamp?: string;
                valueBool?: boolean;
                valueNum?: number;
                valueStr?: string;
            }[];
        }[];
        totalNodes?: number;
        totalSamples?: number;
    }>;
}
export declare class RefsClient extends BaseClient {
    /**
     * Batch update order field for multiple refs atomically
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ success?: boolean; updatedCount?: number }>
     */
    batchReorder(params: {
        orgId: string;
        deviceId: string;
        body: RefBatchReorderRequest;
    }, opts?: RequestOptions): Promise<{
        success?: boolean;
        updatedCount?: number;
    }>;
    /**
     * Create or update a ref (upsert)
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<RefResponse>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        body: RefCreate;
    }, opts?: RequestOptions): Promise<RefResponse>;
    /**
     * Delete a ref
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        refName: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Get a specific ref
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<RefResponse>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        refName: string;
    }, opts?: RequestOptions): Promise<RefResponse>;
    /**
     * Get all refs from a node
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<RefListResponse>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<RefListResponse>;
    /**
     * Get all nodes with a specific ref pointing to target (e.g., all devices in a site)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NodeListResponse>
     */
    listByRef(params: {
        orgId: string;
        deviceId: string;
        refName: string;
        targetId: string;
    }, opts?: RequestOptions): Promise<NodeListResponse>;
    /**
     * Reverse lookup: get all refs pointing TO this node
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<RefListResponse>
     */
    listToNode(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<RefListResponse>;
}
export declare class RuntimeClient extends BaseClient {
    /**
     * Get all cached port values for all nodes in the runtime
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<RuntimeAllValuesResponse>
     */
    getAllValues(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<RuntimeAllValuesResponse>;
    /**
     * Get cached port values for a specific node
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<RuntimeNodeValuesResponse>
     */
    getNodeValues(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<RuntimeNodeValuesResponse>;
    /**
     * Get cached port values for specific nodes (batch fetch to reduce payload size)
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<RuntimeAllValuesResponse>
     */
    getValuesScoped(params: {
        orgId: string;
        deviceId: string;
        body: {
            nodeIds?: string[];
        };
    }, opts?: RequestOptions): Promise<RuntimeAllValuesResponse>;
    /**
     * Get detailed status of which nodes loaded successfully (compares DB vs runtime)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ loadRate?: number; loadedCount?: number; loadedNodes?: { id?: string; name?: string; type?: string }[]; missingCount?: number; missingNodes?: { id?: string; name?: string; type?: string }[]; status?: 'healthy' | 'partial' | 'failed'; totalInDB?: number; totalInRuntime?: number }>
     */
    nodeLoadStatus(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        loadRate?: number;
        loadedCount?: number;
        loadedNodes?: {
            id?: string;
            name?: string;
            type?: string;
        }[];
        missingCount?: number;
        missingNodes?: {
            id?: string;
            name?: string;
            type?: string;
        }[];
        status?: 'healthy' | 'partial' | 'failed';
        totalInDB?: number;
        totalInRuntime?: number;
    }>;
    /**
     * Get all available node types that can be created in runtime
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ nodeTypes?: { category?: string; description?: string; icon?: string; name?: string; type?: string }[] }>
     */
    palletList(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        nodeTypes?: {
            category?: string;
            description?: string;
            icon?: string;
            name?: string;
            type?: string;
        }[];
    }>;
    /**
     * Restart the runtime (stop then start)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; orgId?: string }>
     */
    restart(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        orgId?: string;
    }>;
    /**
     * Get complete flow graph (nodes + edges) - Optimized single query
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ edges?: Edge[]; nodes?: Node[] }>
     */
    snapshot(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        edges?: Edge[];
        nodes?: Node[];
    }>;
    /**
     * Get flow graph scoped to a specific parent node (optimized for React Flow hierarchical navigation)
     * @param params - Request parameters
     * @param params.parentId - Parent node ID. If omitted, returns root nodes (nodes without parentRef)
     * @param params.includeOrphans - Include nodes without parent (orphaned nodes) when fetching root nodes
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ edges?: Edge[]; metadata?: { edgeCount?: number; hasChildren?: boolean; nodeCount?: number }; nodes?: Node[]; parentNode?: Node }>
     */
    snapshotHierarchical(params: {
        orgId: string;
        deviceId: string;
        parentId?: string;
        includeOrphans?: boolean;
    }, opts?: RequestOptions): Promise<{
        edges?: Edge[];
        metadata?: {
            edgeCount?: number;
            hasChildren?: boolean;
            nodeCount?: number;
        };
        nodes?: Node[];
        parentNode?: Node;
    }>;
    /**
     * Start the runtime for an organization
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; orgId?: string }>
     */
    start(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        orgId?: string;
    }>;
    /**
     * Get the runtime status
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ edgeCount?: number; nodeCount?: number; orgId?: string; status?: 'running' | 'stopped' | 'error' }>
     */
    status(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        edgeCount?: number;
        nodeCount?: number;
        orgId?: string;
        status?: 'running' | 'stopped' | 'error';
    }>;
    /**
     * Stop the runtime for an organization
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; orgId?: string }>
     */
    stop(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        orgId?: string;
    }>;
}
export declare class RxaiClient extends BaseClient {
    /**
     * Create a new rxai agent session
     * @param params - Request parameters
     * @param params.orgId - Organization ID
     * @param params.deviceId - Device ID
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    createSession(params: {
        orgId: string;
        deviceId: string;
        body: RxAICreateSessionRequest;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Get session details
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    getSession(params: {
        orgId: string;
        deviceId: string;
        sessionId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * List all actions taken by the agent in a session
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    listActions(params: {
        orgId: string;
        deviceId: string;
        sessionId: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * List all interactions in a session
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    listInteractions(params: {
        orgId: string;
        deviceId: string;
        sessionId: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * List all sessions for this organization
     * @param params - Request parameters
     * @param params.status - Filter by status (active, completed, error)
     * @param params.userId - Filter by user ID
     * @param params.limit - Maximum number of results
     * @param params.offset - Offset for pagination
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    listSessions(params: {
        orgId: string;
        deviceId: string;
        status?: string;
        userId?: string;
        limit?: number;
        offset?: number;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Send message to agent session
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    sendMessage(params: {
        orgId: string;
        deviceId: string;
        sessionId: string;
        body: RxAISendMessageRequest;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Stop an active session
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    stopSession(params: {
        orgId: string;
        deviceId: string;
        sessionId: string;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class SchemasClient extends BaseClient {
    /**
     * Get JSON schema for a specific node type
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<SchemaResponse>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        nodeType: string;
    }, opts?: RequestOptions): Promise<SchemaResponse>;
    /**
     * Get all available JSON schemas for node types
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<SchemasListResponse>
     */
    list(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<SchemasListResponse>;
}
export declare class TabsTemplatesAttachClient extends BaseClient {
    /**
     * Attach a template to a tab via templateRef
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; order?: number; refId?: string; tabId?: string; templateId?: string }>
     */
    attach(params: {
        orgId: string;
        deviceId: string;
        tabId: string;
        templateId: string;
        body: {
            order?: number;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        order?: number;
        refId?: string;
        tabId?: string;
        templateId?: string;
    }>;
    /**
     * Detach a template from a tab (delete templateRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    detach(params: {
        orgId: string;
        deviceId: string;
        tabId: string;
        templateId: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * List all templates attached to a tab
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ count?: number; tabId?: string; templates?: Record<string, unknown>[] }>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        tabId: string;
    }, opts?: RequestOptions): Promise<{
        count?: number;
        tabId?: string;
        templates?: Record<string, unknown>[];
    }>;
}
export declare class TabsWidgetsAttachClient extends BaseClient {
    /**
     * Attach a widget to a tab via widgetRef
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; order?: number; refId?: string; slot?: string; tabId?: string; widgetId?: string }>
     */
    attach(params: {
        orgId: string;
        deviceId: string;
        tabId: string;
        widgetId: string;
        body: {
            order?: number;
            overrides?: Record<string, unknown>;
            slot?: string;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        order?: number;
        refId?: string;
        slot?: string;
        tabId?: string;
        widgetId?: string;
    }>;
    /**
     * Detach a widget from a tab (delete widgetRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    detach(params: {
        orgId: string;
        deviceId: string;
        tabId: string;
        widgetId: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * List all widgets attached to a tab
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ count?: number; tabId?: string; widgets?: Record<string, unknown>[] }>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        tabId: string;
    }, opts?: RequestOptions): Promise<{
        count?: number;
        tabId?: string;
        widgets?: Record<string, unknown>[];
    }>;
}
export declare class TagsClient extends BaseClient {
    /**
     * POST /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        body: TagCreate;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * DELETE /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags/{tagName}
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        tagName: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * PUT /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags/{tagName}
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        nodeId: string;
        tagName: string;
        body: TagUpdate;
    }, opts?: RequestOptions): Promise<any>;
}
export declare class TeamsClient extends BaseClient {
    /**
     * Add user to team
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    addUser(params: {
        orgId: string;
        deviceId: string;
        teamId: string;
        userId: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Assign navigation to team (creates navRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    assignNav(params: {
        orgId: string;
        deviceId: string;
        teamId: string;
        navId: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Create a new team
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<TeamResponse>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        body: CreateTeamRequest;
    }, opts?: RequestOptions): Promise<TeamResponse>;
    /**
     * Delete a team
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        teamId: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Get team details
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<TeamResponse>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        teamId: string;
    }, opts?: RequestOptions): Promise<TeamResponse>;
    /**
     * Get team's assigned navigation
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<NavTreeResponse>
     */
    getNav(params: {
        orgId: string;
        deviceId: string;
        teamId: string;
    }, opts?: RequestOptions): Promise<NavTreeResponse>;
    /**
     * List all teams in an organization
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<TeamsResponse>
     */
    list(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<TeamsResponse>;
    /**
     * List all users in a team
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<UsersResponse>
     */
    listUsers(params: {
        orgId: string;
        deviceId: string;
        teamId: string;
    }, opts?: RequestOptions): Promise<UsersResponse>;
    /**
     * Remove user from team
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    removeUser(params: {
        orgId: string;
        deviceId: string;
        teamId: string;
        userId: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Unassign navigation from team (removes navRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    unassignNav(params: {
        orgId: string;
        deviceId: string;
        teamId: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Update team details
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<TeamResponse>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        teamId: string;
        body: UpdateTeamRequest;
    }, opts?: RequestOptions): Promise<TeamResponse>;
}
export declare class TemplatesClient extends BaseClient {
    /**
     * Create a new template
     * @param params - Request parameters
     * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node }>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        allowUnknown?: boolean;
        body: NodeCreate;
    }, opts?: RequestOptions): Promise<{
        data?: Node;
    }>;
    /**
     * Delete a template
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ id?: string; message?: string }>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<{
        id?: string;
        message?: string;
    }>;
    /**
     * Get a single template by ID
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node }>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<{
        data?: Node;
    }>;
    /**
     * List all templates for an organization/device
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node[]; meta?: { total?: number } }>
     */
    list(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        data?: Node[];
        meta?: {
            total?: number;
        };
    }>;
    /**
     * Update an existing template
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node }>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: NodeUpdate;
    }, opts?: RequestOptions): Promise<{
        data?: Node;
    }>;
}
export declare class TemplatesUsageClient extends BaseClient {
    /**
     * Find all pages that use this template
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ resourceId?: string; resourceName?: string; resourceType?: string; usageCount?: number; usedBy?: unknown[] }>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        templateId: string;
    }, opts?: RequestOptions): Promise<{
        resourceId?: string;
        resourceName?: string;
        resourceType?: string;
        usageCount?: number;
        usedBy?: unknown[];
    }>;
}
export declare class TemplatesValidateClient extends BaseClient {
    /**
     * Validate a template configuration
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }>
     */
    validate(params: {
        orgId: string;
        deviceId: string;
        templateId: string;
    }, opts?: RequestOptions): Promise<{
        errors?: unknown[];
        valid?: boolean;
        warnings?: unknown[];
    }>;
}
export declare class TemplatesWidgetsAttachClient extends BaseClient {
    /**
     * Attach a widget to a template via widgetRef
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; order?: number; refId?: string; templateId?: string; widgetId?: string; zone?: string }>
     */
    attach(params: {
        orgId: string;
        deviceId: string;
        templateId: string;
        widgetId: string;
        body: {
            order?: number;
            overrides?: Record<string, unknown>;
            zone?: string;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        order?: number;
        refId?: string;
        templateId?: string;
        widgetId?: string;
        zone?: string;
    }>;
    /**
     * Detach a widget from a template (delete widgetRef)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; templateId?: string; widgetId?: string }>
     */
    detach(params: {
        orgId: string;
        deviceId: string;
        templateId: string;
        widgetId: string;
    }, opts?: RequestOptions): Promise<{
        message?: string;
        templateId?: string;
        widgetId?: string;
    }>;
    /**
     * List all widgets attached to a template
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ count?: number; templateId?: string; widgets?: Record<string, unknown>[] }>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        templateId: string;
    }, opts?: RequestOptions): Promise<{
        count?: number;
        templateId?: string;
        widgets?: Record<string, unknown>[];
    }>;
    /**
     * Update the order of a widget within a template
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ message?: string; order?: number; templateId?: string; widgetId?: string }>
     */
    reorder(params: {
        orgId: string;
        deviceId: string;
        templateId: string;
        widgetId: string;
        body: {
            order?: number;
        };
    }, opts?: RequestOptions): Promise<{
        message?: string;
        order?: number;
        templateId?: string;
        widgetId?: string;
    }>;
}
export declare class UsersClient extends BaseClient {
    /**
     * Delete a user
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<MessageResponse>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        userId: string;
    }, opts?: RequestOptions): Promise<MessageResponse>;
    /**
     * Get user details
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<UserResponse>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        userId: string;
        includeSettings?: boolean;
    }, opts?: RequestOptions): Promise<UserResponse>;
    /**
     * Invite a new user to the organization
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<UserResponse>
     */
    invite(params: {
        orgId: string;
        deviceId: string;
        body: InviteUserRequest;
    }, opts?: RequestOptions): Promise<UserResponse>;
    /**
     * List all users in an organization
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<UsersResponse>
     */
    list(params: {
        orgId: string;
        deviceId: string;
        includeSettings?: boolean;
    }, opts?: RequestOptions): Promise<UsersResponse>;
    /**
     * Update user details
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<UserResponse>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        userId: string;
        body: UpdateUserRequest;
    }, opts?: RequestOptions): Promise<UserResponse>;
}
export declare class ValidateAllRefsClient extends BaseClient {
    /**
     * Validate all refs in the system (find broken refs)
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }>
     */
    validate(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        errors?: unknown[];
        valid?: boolean;
        warnings?: unknown[];
    }>;
}
export declare class WidgetsClient extends BaseClient {
    /**
     * Create a new ui.widget node
     * @param params - Request parameters
     * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node }>
     */
    create(params: {
        orgId: string;
        deviceId: string;
        allowUnknown?: boolean;
        body: NodeCreate;
    }, opts?: RequestOptions): Promise<{
        data?: Node;
    }>;
    /**
     * Delete a ui.widget node
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<unknown>
     */
    delete(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<unknown>;
    /**
     * Get a specific ui.widget node
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node }>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        id: string;
    }, opts?: RequestOptions): Promise<{
        data?: Node;
    }>;
    /**
     * List all ui.widget nodes
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node[]; meta?: { total?: number } }>
     */
    list(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<{
        data?: Node[];
        meta?: {
            total?: number;
        };
    }>;
    /**
     * Resolve a widget with context and execute its query.
  This is the core endpoint for the context-driven reusable widgets system.
  
  The widget can be from pallet (e.g., "rubix.network:device-info") or
  a custom ui.widget node by ID.
  
  The context is built from:
  - route: URL path parameters
  - args: Query string parameters
  - node: Auto-loaded if context.nodeId is provided
  - user: From authentication
  - context: User-provided in request body
  
  Example:
    POST /orgs/org1/devices/device0/ui/widgets/resolve
    {
      "widgetRef": "rubix.network:device-info",
      "context": {
        "nodeId": "device1"
      }
    }
  
     * @param params - Request parameters
     * @param params.orgId - Organization ID
     * @param params.deviceId - Device ID for routing
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    resolve(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Resolve multiple widgets in a single request.
  More efficient than calling resolve multiple times.
  
     * @param params - Request parameters
     * @param params.orgId - Organization ID
     * @param params.deviceId - Device ID for routing
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<any>
     */
    resolveBatch(params: {
        orgId: string;
        deviceId: string;
    }, opts?: RequestOptions): Promise<any>;
    /**
     * Update an existing ui.widget node
     * @param params - Request parameters
     * @param params.body - Request body
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ data?: Node }>
     */
    update(params: {
        orgId: string;
        deviceId: string;
        id: string;
        body: NodeUpdate;
    }, opts?: RequestOptions): Promise<{
        data?: Node;
    }>;
}
export declare class WidgetsUsageClient extends BaseClient {
    /**
     * Find all pages that use this widget
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ resourceId?: string; resourceName?: string; resourceType?: string; usageCount?: number; usedBy?: unknown[] }>
     */
    get(params: {
        orgId: string;
        deviceId: string;
        widgetId: string;
    }, opts?: RequestOptions): Promise<{
        resourceId?: string;
        resourceName?: string;
        resourceType?: string;
        usageCount?: number;
        usedBy?: unknown[];
    }>;
}
export declare class WidgetsValidateClient extends BaseClient {
    /**
     * Validate a widget configuration
     * @param params - Request parameters
     * @param opts - Optional request options (headers, signal)
     * @returns Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }>
     */
    validate(params: {
        orgId: string;
        deviceId: string;
        widgetId: string;
    }, opts?: RequestOptions): Promise<{
        errors?: unknown[];
        valid?: boolean;
        warnings?: unknown[];
    }>;
}
export declare class RASClient {
    readonly baseURL: string;
    readonly http: HttpClient;
    readonly defaultHeaders?: Record<string, string>;
    admin: AdminClient;
    ai: AiClient;
    alarmClasses: AlarmClassesClient;
    alarms: AlarmsClient;
    association: AssociationClient;
    audit: AuditClient;
    auth: AuthClient;
    backup: BackupClient;
    datastore: DatastoreClient;
    devices: DevicesClient;
    diagnostics: DiagnosticsClient;
    docs: DocsClient;
    edges: EdgesClient;
    emailQueue: EmailQueueClient;
    flows: FlowsClient;
    hierarchy: HierarchyClient;
    histories: HistoriesClient;
    insights: InsightsClient;
    jobs: JobsClient;
    journal: JournalClient;
    nav: NavClient;
    networkDevices: NetworkDevicesClient;
    nodes: NodesClient;
    nodesHierarchy: NodesHierarchyClient;
    nodesPages: NodesPagesClient;
    nodesPagesAttach: NodesPagesAttachClient;
    nodesRelationships: NodesRelationshipsClient;
    nodesValidateRelationships: NodesValidateRelationshipsClient;
    orgAdmin: OrgAdminClient;
    orgs: OrgsClient;
    pages: PagesClient;
    pagesStructure: PagesStructureClient;
    pagesTemplatesAttach: PagesTemplatesAttachClient;
    pagesUsage: PagesUsageClient;
    pagesValidate: PagesValidateClient;
    pagesWidgetsAttach: PagesWidgetsAttachClient;
    pallet: PalletClient;
    ping: PingClient;
    plugins: PluginsClient;
    portMappings: PortMappingsClient;
    ports: PortsClient;
    publicDevice: PublicDeviceClient;
    query: QueryClient;
    refs: RefsClient;
    runtime: RuntimeClient;
    rxai: RxaiClient;
    schemas: SchemasClient;
    tabsTemplatesAttach: TabsTemplatesAttachClient;
    tabsWidgetsAttach: TabsWidgetsAttachClient;
    tags: TagsClient;
    teams: TeamsClient;
    templates: TemplatesClient;
    templatesUsage: TemplatesUsageClient;
    templatesValidate: TemplatesValidateClient;
    templatesWidgetsAttach: TemplatesWidgetsAttachClient;
    users: UsersClient;
    validateAllRefs: ValidateAllRefsClient;
    widgets: WidgetsClient;
    widgetsUsage: WidgetsUsageClient;
    widgetsValidate: WidgetsValidateClient;
    constructor(baseURL?: string, http?: HttpClient, defaultHeaders?: Record<string, string>);
}
