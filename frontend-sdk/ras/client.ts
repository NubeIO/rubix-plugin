// Auto-generated TypeScript client from RAS
// Do not edit manually

/* eslint-disable */

import type { AdminOrgCreate, Alarm, AlarmListResponse, AttachedNodeInfo, Breadcrumb, BulkCommandRequest, BulkCommandResponse, BulkCreateRequest, BulkDeleteEdgesRequest, BulkDeleteRequest, BulkUpdateEdgesRequest, BulkUpdateNodesRequest, CommandDefinition, CommandJob, CreateTeamRequest, DeviceBlacklist, DeviceCreate, DeviceInfo, DeviceUpdate, DisableOrgRequest, EdgeCreate, EdgeUpdate, EmailQueue, EnableOrgRequest, EnumCreateRequest, EnumDef, EnumListResponse, EnumState, EnumUpdateRequest, FlowCreate, FlowExecuteRequest, FlowExecuteResponse, FlowUpdate, HistoryNodesResponse, HistoryPortConfigResponse, HistoryPortsResponse, HistoryStatsResponse, InviteUserRequest, LoginRequest, LoginResponse, MessageResponse, NatsInfo, NavItemResponse, NavPageAction, NavPageDataSource, NavPageLayout, NavPageReference, NavTreeResponse, NetworkDevice, NetworkInfo, Node, NodeCreate, NodeDataStoreItem, NodeListResponse, NodePortValuesResponse, NodeSettingsSchemaResponse, NodeUpdate, NodeValuesInfo, OrgCreate, OrgInfo, OrgInfoStats, OrgStatusResponse, OrgUpdate, PageStructure, PageStructureNode, PalletResponse, PortMapping, PortSubscription, PortValueInfo, PortWithStatus, PortsWithStatusResponse, ProvisionRequest, QuickAction, RedoRequest, RefBatchReorderRequest, RefCreate, RefListResponse, RefResponse, RootDeviceInfo, RubixDeviceInfo, RubixNetworkCreate, RubixNetworkUpdate, RuntimeAllValuesResponse, RuntimeNodeValuesResponse, RuntimeV2Status, RxAIAction, RxAIAgentResponse, RxAICreateSessionRequest, RxAIInteraction, RxAISendMessageRequest, RxAISession, RxAISource, RxAIToolCall, SchemaResponse, SchemasListResponse, SignupRequest, SignupResponse, SyncAuditLog, SyncAuditLogListResponse, SyncAuditLogResponse, SyncAuditStatsResponse, SyncConfig, SyncConfigResponse, SyncStatusResponse, TagCreate, TagUpdate, TeamResponse, TeamsResponse, UndoComment, UndoRequest, UpdateHistoryConfigRequest, UpdateSyncConfigRequest, UpdateTeamRequest, UpdateUserRequest, UserResponse, UsersResponse } from './types';

export const DEFAULT_BASE_URL = '/api/v1';

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

export type HttpClient = (req: HttpRequest) => Promise<{ status: number; statusText: string; headers: Record<string, string| string[]>; data: any }>;

export class RASError extends Error {
  status: number;
  statusText: string;
  url: string;
  details: any;
  constructor(status: number, statusText: string, url: string, details?: any) {
    super('HTTP ' + status + ' ' + statusText);
    this.status = status; this.statusText = statusText; this.url = url; this.details = details;
  }
}

export function buildQuery(q: Record<string, string | number | boolean | undefined | null>): string {
  const params = new URLSearchParams();
  for (const [k,v] of Object.entries(q)) {
    if (v !== undefined && v !== null) params.append(k, String(v));
  }
  return params.toString();
}

// Default fetch adapter (works in browser/Node)
export function fetchAdapter(fetchImpl?: typeof fetch): HttpClient {
  const f = fetchImpl ?? (globalThis as any).fetch;
  if (!f) throw new Error('No fetch available; pass a fetch implementation or use axiosAdapter.');
  return async (req: HttpRequest) => {
    const headers: Record<string, string> = { 'Accept': 'application/json', ...(req.headers || {}) };

    // Inject Authorization header from localStorage if token exists
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('rubix_user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.token) {
            headers['Authorization'] = 'Bearer ' + user.token;
          }
        } catch (e) {
          console.warn('Failed to parse user from localStorage:', e);
        }
      }
    }

    const res = await f(req.url, {
      method: req.method,
      headers,
      body: req.body !== undefined ? (typeof req.body === 'string' || req.body instanceof FormData ? req.body : JSON.stringify(req.body)) : undefined,
      signal: req.signal,
    });
    const ct = res.headers.get('content-type') || '';
    let data: any = null;
    if (res.status !== 204) {
      data = ct.includes('application/json') ? await res.json().catch(()=>null) : await res.text().catch(()=>null);
    }
    if (!res.ok) throw new RASError(res.status, res.statusText, req.url, data);
    const hdrs: Record<string, string> = {};
    res.headers.forEach((v: string, k: string) => { hdrs[k] = v; });
    return { status: res.status, statusText: res.statusText, headers: hdrs, data };
  };
}

// Axios adapter (pass an axios instance)
export function axiosAdapter(axios: any): HttpClient {
  if (!axios) throw new Error('axiosAdapter requires an axios instance');
  return async (req: HttpRequest) => {
    try {
      const r = await axios.request({ method: req.method as any, url: req.url, headers: req.headers, data: req.body, signal: req.signal });
      return { status: r.status, statusText: r.statusText, headers: r.headers || {}, data: r.data };
    } catch (e: any) {
      if (e.response) {
        const r = e.response;
        throw new RASError(r.status, r.statusText || 'Error', req.url, r.data);
      }
      throw e;
    }
  };
}

export class BaseClient {
  constructor(
    protected baseURL: string,
    protected http: HttpClient,
    protected defaultHeaders?: Record<string,string>
  ) {}

  protected async request(req: HttpRequest, opts?: RequestOptions): Promise<any> {
    const headers = { ...(this.defaultHeaders || {}), ...(opts?.headers || {}), ...(req.headers || {}) };
    const merged: HttpRequest = { ...req, headers };
    const res = await this.http(merged);
    return res.data; // return parsed payload only
  }
}

export class AdminClient extends BaseClient {
  /**
   * Disable organization (non-payment, suspension)
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async disableOrg(params: { orgId: string; body: DisableOrgRequest }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/admin/orgs/{orgId}/disable`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Re-enable previously disabled organization
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async enableOrg(params: { orgId: string; body: EnableOrgRequest }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/admin/orgs/{orgId}/enable`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get organization status
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<OrgStatusResponse>
   */
  async getOrgStatus(params: { orgId: string }, opts?: RequestOptions): Promise<OrgStatusResponse> {
    let url = this.baseURL + `/admin/orgs/{orgId}/status`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class AiClient extends BaseClient {
  /**
   * Apply an AI recommendation
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async applyRecommendation(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/recommendations/{id}/apply`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Approve an AI recommendation
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async approveRecommendation(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/recommendations/{id}/approve`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Apply multiple recommendations in batch
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async batchApplyRecommendations(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/recommendations/batch-apply`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Clone an existing AI prompt template
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async cloneTemplate(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/templates/{id}/clone`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Execute AI completion request
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async complete(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/complete`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Create new AI provider
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async createProvider(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/providers`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Create new AI prompt template
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async createTemplate(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/templates`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Delete an AI provider
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async deleteProvider(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/providers/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Delete an AI prompt template
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async deleteTemplate(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/templates/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get AI service configuration
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async getConfig(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/config`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get details of a single AI recommendation
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async getRecommendation(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/recommendations/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get recommendation acceptance rates and effectiveness
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async getRecommendationAnalytics(params: { orgId: string; deviceId: string; timeRange?: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/recommendations/analytics`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.timeRange !== undefined) q['timeRange'] = String(params.timeRange);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get details of a single AI prompt template
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async getTemplate(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/templates/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get AI usage statistics and analytics
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async getUsageStats(params: { orgId: string; deviceId: string; timeRange?: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/stats`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.timeRange !== undefined) q['timeRange'] = String(params.timeRange);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List configured AI providers
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async listProviders(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/providers`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List AI recommendations
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async listRecommendations(params: { orgId: string; deviceId: string; status?: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/recommendations`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.status !== undefined) q['status'] = String(params.status);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List AI request history
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async listRequests(params: { orgId: string; deviceId: string; limit?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/requests`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List AI prompt templates
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async listTemplates(params: { orgId: string; deviceId: string; category?: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/templates`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.category !== undefined) q['category'] = String(params.category);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Reject an AI recommendation
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async rejectRecommendation(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/recommendations/{id}/reject`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Rollback an applied AI recommendation
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async rollbackRecommendation(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/recommendations/{id}/rollback`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update AI service configuration
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async updateConfig(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/config`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update an AI provider
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async updateProvider(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/providers/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update an AI prompt template
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async updateTemplate(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ai/templates/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class AlarmClassesClient extends BaseClient {
  /**
   * POST /orgs/{orgId}/devices/{deviceId}/alarm-classes
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async create(params: { orgId: string; deviceId: string; body: NodeCreate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarm-classes`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/alarm-classes
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NodeListResponse>
   */
  async list(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<NodeListResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarm-classes`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class AlarmsClient extends BaseClient {
  /**
   * POST /orgs/{orgId}/devices/{deviceId}/alarms/{id}/acknowledge
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async acknowledge(params: { orgId: string; deviceId: string; id: string; body: { comment?: string; user?: string } }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/{id}/acknowledge`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/alarms/bulk/acknowledge
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async bulkAcknowledge(params: { orgId: string; deviceId: string; body: { alarmIds?: string[]; comment?: string; user?: string } }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/bulk/acknowledge`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/alarms/bulk/silence
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async bulkSilence(params: { orgId: string; deviceId: string; body: { alarmIds?: string[]; durationMinutes?: number; reason?: string; user?: string } }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/bulk/silence`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/alarms
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async create(params: { orgId: string; deviceId: string; body: NodeCreate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/alarms/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async delete(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/alarms/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async get(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/alarms/{id}/history
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async history(params: { orgId: string; deviceId: string; id: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/{id}/history`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const q: Record<string, string> = {};
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/alarms
   * @param params - Request parameters
   * @param params.type - Filter by alarm type (e.g., rubix.alarm-source.limit)
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<AlarmListResponse>
   */
  async list(params: { orgId: string; deviceId: string; type?: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<AlarmListResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.type !== undefined) q['type'] = String(params.type);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/alarms/{id}/silence
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async silence(params: { orgId: string; deviceId: string; id: string; body: { durationMinutes?: number; reason?: string; user?: string } }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/{id}/silence`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/alarms/stats
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async stats(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/stats`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/alarms/{id}/unacknowledge
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async unacknowledge(params: { orgId: string; deviceId: string; id: string; body: { reason?: string; user?: string } }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/{id}/unacknowledge`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/alarms/{id}/unsilence
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async unsilence(params: { orgId: string; deviceId: string; id: string; body: { user?: string } }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/{id}/unsilence`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/alarms/{id}
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async update(params: { orgId: string; deviceId: string; id: string; body: NodeUpdate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/alarms/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class AssociationClient extends BaseClient {
  /**
   * Create association between two nodes (user→team, nav→team, nav→user) - Admin only
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async create(params: { orgId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/associations`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Remove a specific association - Admin only
   * @param params - Request parameters
   * @param params.refId - Ref ID to delete
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async delete(params: { orgId: string; refId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/associations/{refId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{refId}', encodeURIComponent(String(params.refId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all associations for a node (excludes parentRef) - Admin only
   * @param params - Request parameters
   * @param params.nodeId - Node ID to get associations for (nav, user, or team)
   * @param params.nodeType - Filter by related node type (e.g., auth.user, auth.team, ui.nav). If empty, returns all associations.
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async list(params: { orgId: string; nodeId: string; nodeType?: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/{nodeId}/associations`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const q: Record<string, string> = {};
    if (params.nodeType !== undefined) q['nodeType'] = String(params.nodeType);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

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
  async search(params: { orgId: string; q: string; sourceNodeType?: string; types?: unknown[]; limit?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/search`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const q: Record<string, string> = {};
    if (params.q !== undefined) q['q'] = String(params.q);
    if (params.sourceNodeType !== undefined) q['sourceNodeType'] = String(params.sourceNodeType);
    if (params.types !== undefined) q['types'] = String(params.types);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class AuditClient extends BaseClient {
  /**
   * GET /orgs/{orgId}/devices/{deviceId}/audit/history
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async history(params: { orgId: string; deviceId: string; sessionUUID: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/audit/history`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.sessionUUID !== undefined) q['sessionUUID'] = String(params.sessionUUID);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/audit/redo/{undoAuditId}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async redo(params: { orgId: string; deviceId: string; undoAuditId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/audit/redo/{undoAuditId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{undoAuditId}', encodeURIComponent(String(params.undoAuditId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/audit/redoable
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async redoable(params: { orgId: string; deviceId: string; sessionUUID: string; limit?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/audit/redoable`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.sessionUUID !== undefined) q['sessionUUID'] = String(params.sessionUUID);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/audit/undo/{auditId}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async undo(params: { orgId: string; deviceId: string; auditId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/audit/undo/{auditId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{auditId}', encodeURIComponent(String(params.auditId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/audit/undoable
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async undoable(params: { orgId: string; deviceId: string; sessionUUID: string; limit?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/audit/undoable`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.sessionUUID !== undefined) q['sessionUUID'] = String(params.sessionUUID);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class AuthClient extends BaseClient {
  /**
   * Login with email and password
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<LoginResponse>
   */
  async login(params: { body: LoginRequest }, opts?: RequestOptions): Promise<LoginResponse> {
    let url = this.baseURL + `/auth/login`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Invalidate JWT token
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async logout(params: {  }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/auth/logout`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Create new organization and admin user
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<SignupResponse>
   */
  async signup(params: { body: SignupRequest }, opts?: RequestOptions): Promise<SignupResponse> {
    let url = this.baseURL + `/auth/signup`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class BackupClient extends BaseClient {
  /**
   * DELETE /orgs/{orgId}/backup/{backupId}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ id?: string; message?: string }>
   */
  async delete(params: { orgId: string; backupId: string }, opts?: RequestOptions): Promise<{ id?: string; message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/{backupId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{backupId}', encodeURIComponent(String(params.backupId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/backup/files/{filename}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ filename?: string; message?: string }>
   */
  async deleteFile(params: { orgId: string; filename: string }, opts?: RequestOptions): Promise<{ filename?: string; message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/files/{filename}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{filename}', encodeURIComponent(String(params.filename)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/backup/files/{filename}/download
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async downloadFile(params: { orgId: string; filename: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/backup/files/{filename}/download`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{filename}', encodeURIComponent(String(params.filename)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/backup/export
   * @param params - Request parameters
   * @param params.stream - Stream backup directly instead of creating async job
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: 'pending' | 'running' | 'completed' | 'failed'; type?: string }>
   */
  async export(params: { orgId: string; stream?: boolean; body: { compression?: boolean; prettyPrint?: boolean } }, opts?: RequestOptions): Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: 'pending' | 'running' | 'completed' | 'failed'; type?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/export`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const q: Record<string, string> = {};
    if (params.stream !== undefined) q['stream'] = String(params.stream);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/backup/export/{jobId}/download
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async exportDownload(params: { orgId: string; jobId: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/backup/export/{jobId}/download`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{jobId}', encodeURIComponent(String(params.jobId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/backup/export/{jobId}/status
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ completedAt?: string; createdAt?: string; currentStep?: string; errors?: string[]; id?: string; message?: string; orgId?: string; progress?: number; resultPath?: string; status?: string; type?: string }>
   */
  async exportStatus(params: { orgId: string; jobId: string }, opts?: RequestOptions): Promise<{ completedAt?: string; createdAt?: string; currentStep?: string; errors?: string[]; id?: string; message?: string; orgId?: string; progress?: number; resultPath?: string; status?: string; type?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/export/{jobId}/status`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{jobId}', encodeURIComponent(String(params.jobId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/backup/chain
   * @param params - Request parameters
   * @param params.targetTime - Target timestamp for point-in-time restore (RFC3339)
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ baseBackup?: string; incrementals?: string[]; targetTime?: string }>
   */
  async getBackupChain(params: { orgId: string; targetTime: string }, opts?: RequestOptions): Promise<{ baseBackup?: string; incrementals?: string[]; targetTime?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/chain`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const q: Record<string, string> = {};
    if (params.targetTime !== undefined) q['targetTime'] = String(params.targetTime);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/backup/import
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }>
   */
  async import(params: { orgId: string; body: unknown }, opts?: RequestOptions): Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/import`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/backup/import/{jobId}/status
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ completedAt?: string; createdAt?: string; currentStep?: string; errors?: string[]; id?: string; importReport?: { backupMetadata?: Record<string, unknown>; conflictMode?: string; durationMs?: number; endTime?: string; idMappings?: { edges?: Record<string, string>; nodes?: Record<string, string>; ports?: Record<string, string>; refs?: Record<string, string> }; preserveIds?: boolean; startTime?: string; summary?: { failedRecords?: number; importedRecords?: number; skippedRecords?: number; tablesProcessed?: number; totalRecords?: number }; tables?: Record<string, { durationMs?: number; endTime?: string; errors?: string[]; failedRecords?: number; importedRecords?: number; sampleImported?: string[]; sampleSkipped?: string[]; skippedRecords?: number; startTime?: string; tableName?: string; totalRecords?: number }> }; message?: string; orgId?: string; progress?: number; status?: string; type?: string; validationResult?: { errors?: Record<string, unknown>[]; valid?: boolean; warnings?: Record<string, unknown>[] } }>
   */
  async importStatus(params: { orgId: string; jobId: string }, opts?: RequestOptions): Promise<{ completedAt?: string; createdAt?: string; currentStep?: string; errors?: string[]; id?: string; importReport?: { backupMetadata?: Record<string, unknown>; conflictMode?: string; durationMs?: number; endTime?: string; idMappings?: { edges?: Record<string, string>; nodes?: Record<string, string>; ports?: Record<string, string>; refs?: Record<string, string> }; preserveIds?: boolean; startTime?: string; summary?: { failedRecords?: number; importedRecords?: number; skippedRecords?: number; tablesProcessed?: number; totalRecords?: number }; tables?: Record<string, { durationMs?: number; endTime?: string; errors?: string[]; failedRecords?: number; importedRecords?: number; sampleImported?: string[]; sampleSkipped?: string[]; skippedRecords?: number; startTime?: string; tableName?: string; totalRecords?: number }> }; message?: string; orgId?: string; progress?: number; status?: string; type?: string; validationResult?: { errors?: Record<string, unknown>[]; valid?: boolean; warnings?: Record<string, unknown>[] } }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/import/{jobId}/status`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{jobId}', encodeURIComponent(String(params.jobId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/backup/incremental/export
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }>
   */
  async incrementalExport(params: { orgId: string; body: { compression?: boolean; prettyPrint?: boolean; since?: string; until?: string; useHash?: boolean } }, opts?: RequestOptions): Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/incremental/export`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/backup/incremental/import
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }>
   */
  async incrementalImport(params: { orgId: string; body: unknown }, opts?: RequestOptions): Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/incremental/import`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/backup/files
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: { filename?: string; modifiedAt?: string; size?: number; type?: string }[]; meta?: { total?: number } }>
   */
  async listFiles(params: { orgId: string }, opts?: RequestOptions): Promise<{ data?: { filename?: string; modifiedAt?: string; size?: number; type?: string }[]; meta?: { total?: number } }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/files`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/backup/jobs
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: { createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }[]; meta?: { total?: number } }>
   */
  async listJobs(params: { orgId: string }, opts?: RequestOptions): Promise<{ data?: { createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }[]; meta?: { total?: number } }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/jobs`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/backup/point-in-time/restore
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }>
   */
  async pointInTimeRestore(params: { orgId: string; body: { baseBackupPath?: string; incrementalPaths?: string[]; targetTime?: string; validateOnly?: boolean } }, opts?: RequestOptions): Promise<{ createdAt?: string; id?: string; message?: string; orgId?: string; progress?: number; status?: string; type?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/point-in-time/restore`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/backup/validate
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ errors?: { code?: string; field?: string; message?: string; recordId?: string; table?: string }[]; valid?: boolean; warnings?: { message?: string; table?: string }[] }>
   */
  async validate(params: { orgId: string; body: unknown }, opts?: RequestOptions): Promise<{ errors?: { code?: string; field?: string; message?: string; recordId?: string; table?: string }[]; valid?: boolean; warnings?: { message?: string; table?: string }[] }> {
    let url = this.baseURL + `/orgs/{orgId}/backup/validate`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class DatastoreClient extends BaseClient {
  /**
   * Count entries in a node's datastore bucket
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ bucket?: string; count?: number; nodeId?: string }>
   */
  async count(params: { orgId: string; deviceId: string; nodeId: string; bucket?: string }, opts?: RequestOptions): Promise<{ bucket?: string; count?: number; nodeId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/datastore/count`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const q: Record<string, string> = {};
    if (params.bucket !== undefined) q['bucket'] = String(params.bucket);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Create a datastore entry at index (enforces maxVersions if provided)
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NodeDataStoreItem>
   */
  async create(params: { orgId: string; deviceId: string; nodeId: string; index: number; bucket?: string; maxVersions?: number; body: Record<string, unknown> }, opts?: RequestOptions): Promise<NodeDataStoreItem> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/datastore/{index}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{index}', encodeURIComponent(String(params.index)));
    const q: Record<string, string> = {};
    if (params.bucket !== undefined) q['bucket'] = String(params.bucket);
    if (params.maxVersions !== undefined) q['maxVersions'] = String(params.maxVersions);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Delete a datastore entry at index
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async delete(params: { orgId: string; deviceId: string; nodeId: string; index: number; bucket?: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/datastore/{index}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{index}', encodeURIComponent(String(params.index)));
    const q: Record<string, string> = {};
    if (params.bucket !== undefined) q['bucket'] = String(params.bucket);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get a datastore entry by index
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NodeDataStoreItem>
   */
  async get(params: { orgId: string; deviceId: string; nodeId: string; index: number; bucket?: string }, opts?: RequestOptions): Promise<NodeDataStoreItem> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/datastore/{index}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{index}', encodeURIComponent(String(params.index)));
    const q: Record<string, string> = {};
    if (params.bucket !== undefined) q['bucket'] = String(params.bucket);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List datastore entries for a node bucket
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ count?: number; items?: NodeDataStoreItem[] }>
   */
  async list(params: { orgId: string; deviceId: string; nodeId: string; bucket?: string; limit?: number; offset?: number; orderBy?: string }, opts?: RequestOptions): Promise<{ count?: number; items?: NodeDataStoreItem[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/datastore`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const q: Record<string, string> = {};
    if (params.bucket !== undefined) q['bucket'] = String(params.bucket);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    if (params.orderBy !== undefined) q['orderBy'] = String(params.orderBy);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update a datastore entry at index
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NodeDataStoreItem>
   */
  async update(params: { orgId: string; deviceId: string; nodeId: string; index: number; bucket?: string; body: Record<string, unknown> }, opts?: RequestOptions): Promise<NodeDataStoreItem> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/datastore/{index}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{index}', encodeURIComponent(String(params.index)));
    const q: Record<string, string> = {};
    if (params.bucket !== undefined) q['bucket'] = String(params.bucket);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class DevicesClient extends BaseClient {
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
  async communicationQuery(params: { orgId: string; deviceId: string; from?: string; to?: string; network?: 'local' | 'global'; detail?: 'basic' | 'full' }, opts?: RequestOptions): Promise<{ network?: 'local' | 'global'; query?: { from?: string[]; to?: string[] }; routes?: { details?: { fromConnectionId?: number; messageCount?: number; publishers?: string[]; subscribers?: string[]; toConnectionId?: number }; from?: string; matchedSubjects?: string[]; status?: 'active' | 'inactive' | 'broken'; to?: string }[]; summary?: { activeRoutes?: number; brokenRoutes?: number; totalRoutes?: number }; timestamp?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/network/communication`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.from !== undefined) q['from'] = String(params.from);
    if (params.to !== undefined) q['to'] = String(params.to);
    if (params.network !== undefined) q['network'] = String(params.network);
    if (params.detail !== undefined) q['detail'] = String(params.detail);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Test message routing to see which devices would receive a message
   * @param params - Request parameters
   * @param params.network - NATS network to query: local or global
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ network?: 'local' | 'global'; results?: { connectionStatus?: 'active' | 'inactive'; device?: string; matchedPatterns?: { connectionId?: number; matchType?: string; pattern?: string }[]; reason?: string; subscriptions?: string[]; wouldReceive?: boolean }[]; summary?: { totalDevices?: number; wouldNotReceive?: number; wouldReceive?: number }; test?: { from?: string[]; subject?: string; to?: string[] }; timestamp?: string }>
   */
  async communicationTest(params: { orgId: string; deviceId: string; network?: 'local' | 'global'; body: { from?: string[]; includeInactive?: boolean; subject?: string; to?: string[] } }, opts?: RequestOptions): Promise<{ network?: 'local' | 'global'; results?: { connectionStatus?: 'active' | 'inactive'; device?: string; matchedPatterns?: { connectionId?: number; matchType?: string; pattern?: string }[]; reason?: string; subscriptions?: string[]; wouldReceive?: boolean }[]; summary?: { totalDevices?: number; wouldNotReceive?: number; wouldReceive?: number }; test?: { from?: string[]; subject?: string; to?: string[] }; timestamp?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/network/communication/test`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.network !== undefined) q['network'] = String(params.network);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/devices
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async create(params: { orgId: string; deviceId: string; body: DeviceCreate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/devices`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/devices/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async delete(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/devices/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/devices/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async get(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/devices/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get comprehensive device information including root device and all child devices
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ childDevices?: { deviceId?: string; hardwareModel?: string; name?: string; nodeId?: string; role?: string; serialNumber?: string; status?: 'online' | 'offline' | 'discovered' | 'provisioned'; type?: string }[]; orgId?: string; rootDevice?: { deviceId?: string; deviceName?: string; nats?: { globalStatus?: string; globalUrl?: string; localStatus?: string; localUrl?: string }; role?: string; status?: 'online' | 'offline'; type?: string; uptime?: number; version?: string }; stats?: { offlineDevices?: number; onlineDevices?: number; totalDevices?: number }; timestamp?: string }>
   */
  async getInfo(params: { orgId: string }, opts?: RequestOptions): Promise<{ childDevices?: { deviceId?: string; hardwareModel?: string; name?: string; nodeId?: string; role?: string; serialNumber?: string; status?: 'online' | 'offline' | 'discovered' | 'provisioned'; type?: string }[]; orgId?: string; rootDevice?: { deviceId?: string; deviceName?: string; nats?: { globalStatus?: string; globalUrl?: string; localStatus?: string; localUrl?: string }; role?: string; status?: 'online' | 'offline'; type?: string; uptime?: number; version?: string }; stats?: { offlineDevices?: number; onlineDevices?: number; totalDevices?: number }; timestamp?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/info`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/devices
   * @param params - Request parameters
   * @param params.siteId - Filter by site/parent (e.g., site--sydney)
   * @param params.type - Filter by device type (e.g., ahu, vav, chiller)
   * @param params.tags - Additional tag filters as JSON (e.g., {"floor":"3"})
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node[]; total?: number }>
   */
  async list(params: { orgId: string; deviceId: string; siteId?: string; type?: string; tags?: string }, opts?: RequestOptions): Promise<{ data?: Node[]; total?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/devices`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.siteId !== undefined) q['siteId'] = String(params.siteId);
    if (params.type !== undefined) q['type'] = String(params.type);
    if (params.tags !== undefined) q['tags'] = String(params.tags);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get NATS monitoring statistics for network connections and subscriptions
   * @param params - Request parameters
   * @param params.network - NATS network to query: local or global
   * @param params.format - Response format: raw (all endpoints) or parsed (analyzed data)
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ connections?: { cid?: number; device?: string; ip?: string; name?: string; subscriptions?: number }[]; connz?: Record<string, unknown>; deviceStats?: Record<string, { connectionId?: number; deviceId?: string; inMessages?: number; outMessages?: number; subjects?: string[]; subscriptions?: number }>; natsMonitoring?: { available?: boolean; error?: string }; network?: 'local' | 'global'; serverInfo?: { connections?: number; serverId?: string; subscriptions?: number; totalBytes?: number; totalMessages?: number; uptime?: string; version?: string }; subscriptions?: { device?: string; msgs?: number; subject?: string }[]; subsz?: Record<string, unknown>; timestamp?: string; varz?: Record<string, unknown> }>
   */
  async networkStats(params: { orgId: string; deviceId: string; network?: 'local' | 'global'; format?: 'raw' | 'parsed' }, opts?: RequestOptions): Promise<{ connections?: { cid?: number; device?: string; ip?: string; name?: string; subscriptions?: number }[]; connz?: Record<string, unknown>; deviceStats?: Record<string, { connectionId?: number; deviceId?: string; inMessages?: number; outMessages?: number; subjects?: string[]; subscriptions?: number }>; natsMonitoring?: { available?: boolean; error?: string }; network?: 'local' | 'global'; serverInfo?: { connections?: number; serverId?: string; subscriptions?: number; totalBytes?: number; totalMessages?: number; uptime?: string; version?: string }; subscriptions?: { device?: string; msgs?: number; subject?: string }[]; subsz?: Record<string, unknown>; timestamp?: string; varz?: Record<string, unknown> }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/network/stats`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.network !== undefined) q['network'] = String(params.network);
    if (params.format !== undefined) q['format'] = String(params.format);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/devices/{id}
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async update(params: { orgId: string; deviceId: string; id: string; body: DeviceUpdate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/devices/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class DiagnosticsClient extends BaseClient {
  /**
   * Overall system health check - runtime, history, sync, NATS, database, scheduler
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ components?: Record<string, unknown>; status?: 'healthy' | 'degraded' | 'unhealthy'; summary?: string; timestamp?: string }>
   */
  async health(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ components?: Record<string, unknown>; status?: 'healthy' | 'degraded' | 'unhealthy'; summary?: string; timestamp?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/diagnostics/health`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Check if a specific node is loaded and running in the runtime
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ lastExecution?: string; nodeInfo?: Record<string, unknown>; nodeLoaded?: boolean; outputs?: Record<string, unknown>; runtimeRunning?: boolean }>
   */
  async nodeStatus(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<{ lastExecution?: string; nodeInfo?: Record<string, unknown>; nodeLoaded?: boolean; outputs?: Record<string, unknown>; runtimeRunning?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/diagnostics/node-status/{nodeId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class DocsClient extends BaseClient {
  /**
   * GET /orgs/{orgId}/devices/{deviceId}/docs/manifest
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async manifest(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/docs/manifest`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/docs/{sectionId}/{pageId}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async page(params: { orgId: string; deviceId: string; sectionId: string; pageId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/docs/{sectionId}/{pageId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{sectionId}', encodeURIComponent(String(params.sectionId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/docs/search
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async search(params: { orgId: string; deviceId: string; q: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/docs/search`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.q !== undefined) q['q'] = String(params.q);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class EdgesClient extends BaseClient {
  /**
   * POST /orgs/{orgId}/devices/{deviceId}/edges/bulk
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ createdCount?: number; edges?: Edge[] }>
   */
  async bulkCreate(params: { orgId: string; deviceId: string; body: unknown[] }, opts?: RequestOptions): Promise<{ createdCount?: number; edges?: Edge[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/edges/bulk`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/edges/bulk
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ deletedCount?: number; message?: string }>
   */
  async bulkDelete(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ deletedCount?: number; message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/edges/bulk`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/edges/bulk
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ edges?: Edge[]; updatedCount?: number }>
   */
  async bulkUpdate(params: { orgId: string; deviceId: string; body: BulkUpdateEdgesRequest }, opts?: RequestOptions): Promise<{ edges?: Edge[]; updatedCount?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/edges/bulk`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/edges
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Edge>
   */
  async create(params: { orgId: string; deviceId: string; body: EdgeCreate }, opts?: RequestOptions): Promise<Edge> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/edges`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/edges/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async delete(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/edges/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/edges/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Edge>
   */
  async get(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<Edge> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/edges/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/edges
   * @param params - Request parameters
   * @param params.source - Filter by source node ID
   * @param params.target - Filter by target node ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Edge[]>
   */
  async list(params: { orgId: string; deviceId: string; source?: string; target?: string }, opts?: RequestOptions): Promise<Edge[]> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/edges`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.source !== undefined) q['source'] = String(params.source);
    if (params.target !== undefined) q['target'] = String(params.target);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/edges/{id}
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Edge>
   */
  async update(params: { orgId: string; deviceId: string; id: string; body: EdgeUpdate }, opts?: RequestOptions): Promise<Edge> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/edges/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class EmailQueueClient extends BaseClient {
  /**
   * POST /orgs/{orgId}/devices/{deviceId}/email-queue/bulk/delete
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ deletedCount?: number; message?: string }>
   */
  async bulkDelete(params: { orgId: string; deviceId: string; body: { emailIds?: string[]; status?: string } }, opts?: RequestOptions): Promise<{ deletedCount?: number; message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/email-queue/bulk/delete`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/email-queue/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ emailId?: string; message?: string }>
   */
  async delete(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<{ emailId?: string; message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/email-queue/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/email-queue/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<EmailQueue>
   */
  async get(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<EmailQueue> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/email-queue/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/email-queue
   * @param params - Request parameters
   * @param params.status - Filter by status (pending, sending, sent, failed)
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: EmailQueue[]; total?: number }>
   */
  async list(params: { orgId: string; deviceId: string; status?: string; limit?: number }, opts?: RequestOptions): Promise<{ data?: EmailQueue[]; total?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/email-queue`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.status !== undefined) q['status'] = String(params.status);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/email-queue/{id}/resend
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ emailId?: string; message?: string; status?: string }>
   */
  async resend(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<{ emailId?: string; message?: string; status?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/email-queue/{id}/resend`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/email-queue/stats
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ orgId?: string; stats?: Record<string, number>; total?: number }>
   */
  async stats(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ orgId?: string; stats?: Record<string, number>; total?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/email-queue/stats`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class FlowsClient extends BaseClient {
  /**
   * Create flow for org (normally auto-created on org creation)
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Flow>
   */
  async create(params: { orgId: string; deviceId: string; body: FlowCreate }, opts?: RequestOptions): Promise<Flow> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/flow`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Delete flow and ALL its nodes/edges - DANGEROUS!
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async delete(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/flow`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get flow metadata (status, name, etc.) - Always returns the 'main' flow
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Flow>
   */
  async get(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<Flow> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/flow`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get complete flow graph (nodes + edges) for React Flow - Optimized single query
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ edges?: Edge[]; flow?: Flow; nodes?: Node[] }>
   */
  async snapshot(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ edges?: Edge[]; flow?: Flow; nodes?: Node[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/snapshot`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update flow metadata (e.g., status: running/stopped)
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Flow>
   */
  async update(params: { orgId: string; deviceId: string; body: FlowUpdate }, opts?: RequestOptions): Promise<Flow> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/flow`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'PATCH', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class HierarchyClient extends BaseClient {
  /**
   * GET /orgs/{orgId}/devices/{deviceId}/hierarchy/tree
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async getfulltree(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/hierarchy/tree`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/hierarchy/stats
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async getstats(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/hierarchy/stats`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/hierarchy/grouped
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async listgrouped(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/hierarchy/grouped`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/hierarchy/orphans
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async listorphans(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/hierarchy/orphans`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class HistoriesClient extends BaseClient {
  /**
   * Get all synced history values from other devices
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ count?: number; samples?: { isSynced?: boolean; nodeId?: string; portId?: string; sourceDeviceId?: string; timestamp?: string; valueBool?: boolean; valueNum?: number; valueStr?: string }[] }>
   */
  async all(params: { orgId: string; deviceId: string; limit?: number }, opts?: RequestOptions): Promise<{ count?: number; samples?: { isSynced?: boolean; nodeId?: string; portId?: string; sourceDeviceId?: string; timestamp?: string; valueBool?: boolean; valueNum?: number; valueStr?: string }[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/histories/all`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Comprehensive history diagnostics - check if node exists, port config, registration, samples in mem/disk
   * @param params - Request parameters
   * @param params.nodeId - Node ID to diagnose
   * @param params.portHandle - Port handle (e.g., 'out')
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ details?: { historyManager?: Record<string, unknown>; node?: Record<string, unknown>; port?: Record<string, unknown>; samples?: Record<string, unknown>; sync?: Record<string, unknown> }; issues?: string[]; recommendations?: string[]; status?: 'ok' | 'warning' | 'error'; summary?: string }>
   */
  async diagnostics(params: { orgId: string; deviceId: string; nodeId: string; portHandle: string }, opts?: RequestOptions): Promise<{ details?: { historyManager?: Record<string, unknown>; node?: Record<string, unknown>; port?: Record<string, unknown>; samples?: Record<string, unknown>; sync?: Record<string, unknown> }; issues?: string[]; recommendations?: string[]; status?: 'ok' | 'warning' | 'error'; summary?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/histories/diagnostics`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.nodeId !== undefined) q['nodeId'] = String(params.nodeId);
    if (params.portHandle !== undefined) q['portHandle'] = String(params.portHandle);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all ports (inputs and outputs) for a node with their history settings
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ inputs?: { handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; name?: string; type?: string }[]; nodeId?: string; nodeName?: string; outputs?: { handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; name?: string; type?: string }[] }>
   */
  async getNodePorts(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<{ inputs?: { handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; name?: string; type?: string }[]; nodeId?: string; nodeName?: string; outputs?: { handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; name?: string; type?: string }[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/histories/nodes/{nodeId}/ports`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get history configuration for a specific port
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<HistoryPortConfigResponse>
   */
  async getPortConfig(params: { orgId: string; deviceId: string; nodeId: string; portId: string }, opts?: RequestOptions): Promise<HistoryPortConfigResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/histories/ports/{nodeId}/{portId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portId}', encodeURIComponent(String(params.portId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get history manager statistics
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<HistoryStatsResponse>
   */
  async getStats(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<HistoryStatsResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/histories/stats`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all nodes with history-enabled ports
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<HistoryNodesResponse>
   */
  async listEnabledNodes(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<HistoryNodesResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/histories/nodes`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all history-enabled ports across all nodes
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async listEnabledPorts(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/histories/ports`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get recent historical samples for a specific port
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ count?: number; dateRange?: Record<string, unknown>; samples?: unknown[] }>
   */
  async portSamples(params: { orgId: string; deviceId: string; nodeId: string; portHandle: string; limit?: number }, opts?: RequestOptions): Promise<{ count?: number; dateRange?: Record<string, unknown>; samples?: unknown[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/histories/port-samples`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.nodeId !== undefined) q['nodeId'] = String(params.nodeId);
    if (params.portHandle !== undefined) q['portHandle'] = String(params.portHandle);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Enable/disable history and update settings (COV, interval, etc.)
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<HistoryPortConfigResponse>
   */
  async updatePortConfig(params: { orgId: string; deviceId: string; nodeId: string; portId: string; body: UpdateHistoryConfigRequest }, opts?: RequestOptions): Promise<HistoryPortConfigResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/histories/ports/{nodeId}/{portId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portId}', encodeURIComponent(String(params.portId)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class InsightsClient extends BaseClient {
  /**
   * Get AI request history for an insight
   * @param params - Request parameters
   * @param params.limit - Maximum number of results
   * @param params.offset - Offset for pagination
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async aiHistory(params: { orgId: string; deviceId: string; id: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/insights/{id}/ai-history`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const q: Record<string, string> = {};
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Request AI analysis for an insight
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async aiRequest(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/insights/{id}/ai-request`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Assign an insight to a user
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async assign(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/insights/{id}/assign`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Create a new insight
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async create(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/insights`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get event history for an insight
   * @param params - Request parameters
   * @param params.limit - Maximum number of results
   * @param params.offset - Offset for pagination
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async events(params: { orgId: string; deviceId: string; id: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/insights/{id}/events`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const q: Record<string, string> = {};
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get a single insight by ID
   * @param params - Request parameters
   * @param params.includeDetail - Include detailed analysis
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async get(params: { orgId: string; deviceId: string; id: string; includeDetail?: boolean }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/insights/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const q: Record<string, string> = {};
    if (params.includeDetail !== undefined) q['includeDetail'] = String(params.includeDetail);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

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
  async list(params: { orgId: string; deviceId: string; status?: unknown[]; priority?: unknown[]; impactLevel?: unknown[]; assignedTo?: string; building?: string; category?: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/insights`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.status !== undefined) q['status'] = String(params.status);
    if (params.priority !== undefined) q['priority'] = String(params.priority);
    if (params.impactLevel !== undefined) q['impactLevel'] = String(params.impactLevel);
    if (params.assignedTo !== undefined) q['assignedTo'] = String(params.assignedTo);
    if (params.building !== undefined) q['building'] = String(params.building);
    if (params.category !== undefined) q['category'] = String(params.category);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Mark insight as resolved
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async resolve(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/insights/{id}/resolve`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get aggregated insights statistics
   * @param params - Request parameters
   * @param params.category - Filter statistics by category
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async stats(params: { orgId: string; deviceId: string; category?: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/insights/stats`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.category !== undefined) q['category'] = String(params.category);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update insight status
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async updateStatus(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/insights/{id}/status`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class JobsClient extends BaseClient {
  /**
   * Disable a scheduler job
   * @param params - Request parameters
   * @param params.jobId - Scheduler job ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ job?: Record<string, unknown>; message?: string; success?: boolean }>
   */
  async disable(params: { orgId: string; deviceId: string; jobId: string }, opts?: RequestOptions): Promise<{ job?: Record<string, unknown>; message?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/jobs/{jobId}/disable`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{jobId}', encodeURIComponent(String(params.jobId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Enable a scheduler job
   * @param params - Request parameters
   * @param params.jobId - Scheduler job ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ job?: Record<string, unknown>; message?: string; success?: boolean }>
   */
  async enable(params: { orgId: string; deviceId: string; jobId: string }, opts?: RequestOptions): Promise<{ job?: Record<string, unknown>; message?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/jobs/{jobId}/enable`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{jobId}', encodeURIComponent(String(params.jobId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get details of a specific scheduler job
   * @param params - Request parameters
   * @param params.jobId - Scheduler job ID (e.g., "history-flush", "port-override-timeout-...")
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ createdAt?: string; description?: string; enabled?: boolean; id?: string; name?: string; schedule?: string; stats?: Record<string, unknown>; tags?: string[]; updatedAt?: string }>
   */
  async get(params: { orgId: string; deviceId: string; jobId: string }, opts?: RequestOptions): Promise<{ createdAt?: string; description?: string; enabled?: boolean; id?: string; name?: string; schedule?: string; stats?: Record<string, unknown>; tags?: string[]; updatedAt?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/jobs/{jobId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{jobId}', encodeURIComponent(String(params.jobId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all scheduler jobs (not command jobs - those are at /nodes/{nodeId}/jobs)
   * @param params - Request parameters
   * @param params.enabled - Filter by enabled status
   * @param params.tags - Filter by tags (comma-separated)
   * @param params.nodeId - Filter by node ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ count?: number; jobs?: { createdAt?: string; description?: string; enabled?: boolean; expiresIn?: string; id?: string; lastRunTimeAgo?: string; metadata?: { duration?: string; expiresAt?: string; nodeId?: string; portId?: string; type?: 'recurring' | 'one-time' }; name?: string; nextRunTimeFrom?: string; schedule?: string; stats?: { averageRuntimeMs?: number; failedRuns?: number; lastError?: string; lastRunDurationMs?: number; lastRunTime?: string; nextRunTime?: string; successfulRuns?: number; totalRuns?: number }; tags?: string[]; updatedAt?: string }[] }>
   */
  async listAll(params: { orgId: string; deviceId: string; enabled?: boolean; tags?: string; nodeId?: string }, opts?: RequestOptions): Promise<{ count?: number; jobs?: { createdAt?: string; description?: string; enabled?: boolean; expiresIn?: string; id?: string; lastRunTimeAgo?: string; metadata?: { duration?: string; expiresAt?: string; nodeId?: string; portId?: string; type?: 'recurring' | 'one-time' }; name?: string; nextRunTimeFrom?: string; schedule?: string; stats?: { averageRuntimeMs?: number; failedRuns?: number; lastError?: string; lastRunDurationMs?: number; lastRunTime?: string; nextRunTime?: string; successfulRuns?: number; totalRuns?: number }; tags?: string[]; updatedAt?: string }[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/jobs`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.enabled !== undefined) q['enabled'] = String(params.enabled);
    if (params.tags !== undefined) q['tags'] = String(params.tags);
    if (params.nodeId !== undefined) q['nodeId'] = String(params.nodeId);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Remove a scheduler job (use with caution - may break system functionality)
   * @param params - Request parameters
   * @param params.jobId - Scheduler job ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; success?: boolean }>
   */
  async remove(params: { orgId: string; deviceId: string; jobId: string }, opts?: RequestOptions): Promise<{ message?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/jobs/{jobId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{jobId}', encodeURIComponent(String(params.jobId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Run a scheduler job immediately (outside its schedule)
   * @param params - Request parameters
   * @param params.jobId - Scheduler job ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ jobId?: string; message?: string; success?: boolean }>
   */
  async runNow(params: { orgId: string; deviceId: string; jobId: string }, opts?: RequestOptions): Promise<{ jobId?: string; message?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/jobs/{jobId}/run`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{jobId}', encodeURIComponent(String(params.jobId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get overall scheduler statistics
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ disabledJobs?: number; enabledJobs?: number; totalFailures?: number; totalJobs?: number; totalRuns?: number }>
   */
  async stats(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ disabledJobs?: number; enabledJobs?: number; totalFailures?: number; totalJobs?: number; totalRuns?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/jobs/stats`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class JournalClient extends BaseClient {
  /**
   * GET /orgs/{orgId}/devices/{deviceId}/journal/transactions/{txid}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async gettransaction(params: { orgId: string; deviceId: string; txid: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/journal/transactions/{txid}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{txid}', encodeURIComponent(String(params.txid)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/journal/history
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async history(params: { orgId: string; deviceId: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/journal/history`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/journal/redo
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async redo(params: { orgId: string; deviceId: string; body: RedoRequest }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/journal/redo`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/journal/undo
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async undo(params: { orgId: string; deviceId: string; body: UndoRequest }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/journal/undo`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/journal/undo/{txid}
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async undototransaction(params: { orgId: string; deviceId: string; txid: string; body: UndoComment }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/journal/undo/{txid}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{txid}', encodeURIComponent(String(params.txid)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class NavClient extends BaseClient {
  /**
   * POST /orgs/{orgId}/devices/{deviceId}/nav
   * @param params - Request parameters
   * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async create(params: { orgId: string; deviceId: string; allowUnknown?: boolean; body: NodeCreate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nav`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.allowUnknown !== undefined) q['allowUnknown'] = String(params.allowUnknown);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/nav/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async delete(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nav/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nav/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async get(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nav/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all organizations (Level 1 navigation)
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ items?: { icon?: string; id?: string; label?: string; type?: string; url?: string }[] }>
   */
  async getOrgs(params: {  }, opts?: RequestOptions): Promise<{ items?: { icon?: string; id?: string; label?: string; type?: string; url?: string }[] }> {
    let url = this.baseURL + `/sidebar`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nav
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node[]>
   */
  async list(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<Node[]> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nav`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get immediate children of a node for lazy-loading navigation (device-scoped)
   * @param params - Request parameters
   * @param params.nodeType - Filter children by node type (e.g., rubix.network, rubix.device). Only children matching this nodeType will be returned.
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ items?: NavItemResponse[]; nodeId?: string; nodeType?: string; pages?: Record<string, unknown> }>
   */
  async navChildren(params: { orgId: string; deviceId: string; nodeId: string; nodeType?: string }, opts?: RequestOptions): Promise<{ items?: NavItemResponse[]; nodeId?: string; nodeType?: string; pages?: Record<string, unknown> }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/nav-children`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const q: Record<string, string> = {};
    if (params.nodeType !== undefined) q['nodeType'] = String(params.nodeType);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get navigation info for a specific node (for breadcrumbs, etc.)
   * @param params - Request parameters
   * @param params.orgId - Organization ID
   * @param params.deviceId - Device ID
   * @param params.nodeId - Node ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ icon?: string; name?: string; nodeId?: string; type?: string }>
   */
  async navInfo(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<{ icon?: string; name?: string; nodeId?: string; type?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/nav-info`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get organization sidebar (root device tree with showOrg=true)
   * @param params - Request parameters
   * @param params.orgId - Organization ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ deviceId?: string; deviceName?: string; deviceType?: string; items?: NavItemResponse[]; nodeId?: string; nodeType?: string; orgId?: string; pages?: Record<string, { icon?: string; isDefault?: boolean; order?: number; pageId?: string; source?: string; title?: string }>; showOrg?: boolean }>
   */
  async orgSidebar(params: { orgId: string }, opts?: RequestOptions): Promise<{ deviceId?: string; deviceName?: string; deviceType?: string; items?: NavItemResponse[]; nodeId?: string; nodeType?: string; orgId?: string; pages?: Record<string, { icon?: string; isDefault?: boolean; order?: number; pageId?: string; source?: string; title?: string }>; showOrg?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/sidebar`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

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
  async sidebar(params: { orgId: string; deviceId: string; depth?: number; includeRemoteDevices?: boolean; nodeType?: string; nodeId?: string; withBreadcrumbs?: boolean; pageView?: string }, opts?: RequestOptions): Promise<NavTreeResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/sidebar`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.depth !== undefined) q['depth'] = String(params.depth);
    if (params.includeRemoteDevices !== undefined) q['includeRemoteDevices'] = String(params.includeRemoteDevices);
    if (params.nodeType !== undefined) q['nodeType'] = String(params.nodeType);
    if (params.nodeId !== undefined) q['nodeId'] = String(params.nodeId);
    if (params.withBreadcrumbs !== undefined) q['withBreadcrumbs'] = String(params.withBreadcrumbs);
    if (params.pageView !== undefined) q['pageView'] = String(params.pageView);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/nav/{id}
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async update(params: { orgId: string; deviceId: string; id: string; body: NodeUpdate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nav/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class NetworkDevicesClient extends BaseClient {
  /**
   * Add a device to this device's rubix network configuration
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NetworkDevice>
   */
  async addNetworkDevice(params: { orgId: string; deviceId: string; body: { id?: string; metadata?: Record<string, unknown>; name?: string } }, opts?: RequestOptions): Promise<NetworkDevice> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/network-devices`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get a specific network device by ID
   * @param params - Request parameters
   * @param params.networkDeviceId - Network device ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NetworkDevice>
   */
  async getNetworkDevice(params: { orgId: string; deviceId: string; networkDeviceId: string }, opts?: RequestOptions): Promise<NetworkDevice> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/network-devices/{networkDeviceId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{networkDeviceId}', encodeURIComponent(String(params.networkDeviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get list of devices in this device's network (from config)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NetworkDevice[]>
   */
  async listNetworkDevices(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<NetworkDevice[]> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/network-devices`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all exposed ports from devices in my network
   * @param params - Request parameters
   * @param params.network - Filter by network type
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async listNetworkExposedPorts(params: { orgId: string; deviceId: string; network?: 'local' | 'global' }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/network-exposed-ports`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.network !== undefined) q['network'] = String(params.network);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Remove a device from this device's rubix network configuration
   * @param params - Request parameters
   * @param params.networkDeviceId - Network device ID to remove
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string }>
   */
  async removeNetworkDevice(params: { orgId: string; deviceId: string; networkDeviceId: string }, opts?: RequestOptions): Promise<{ message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/network-devices/{networkDeviceId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{networkDeviceId}', encodeURIComponent(String(params.networkDeviceId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class NodesClient extends BaseClient {
  /**
   * POST /orgs/{orgId}/devices/{deviceId}/nodes/actions
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ affectedCount?: number; message?: string; nodes?: Node[] }>
   */
  async actions(params: { orgId: string; deviceId: string; body: { action?: 'copy' | 'move' | 'delete' | 'duplicate-selection'; includeChildren?: boolean; includeEdges?: boolean; nodeIds?: string[]; offset?: { x?: number; y?: number }; targetParentId?: string } }, opts?: RequestOptions): Promise<{ affectedCount?: number; message?: string; nodes?: Node[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/actions`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/nodes/batch-update
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ nodes?: Node[]; updatedCount?: number }>
   */
  async batchUpdate(params: { orgId: string; deviceId: string; body: { updates?: { data?: Record<string, unknown>; id?: string; position?: { x?: number; y?: number } }[] } }, opts?: RequestOptions): Promise<{ nodes?: Node[]; updatedCount?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/batch-update`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

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
  async bulkCreate(params: { orgId: string; deviceId: string; allowUnknown?: boolean; delete?: boolean; start?: boolean; parentId?: string; body: BulkCreateRequest }, opts?: RequestOptions): Promise<{ createdCount?: number; deletedCount?: number; errors?: { index?: number; message?: string; nodeId?: string }[]; nodes?: Node[]; runtimeStarted?: boolean; skippedCount?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/bulk-create`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.allowUnknown !== undefined) q['allowUnknown'] = String(params.allowUnknown);
    if (params.delete !== undefined) q['delete'] = String(params.delete);
    if (params.start !== undefined) q['start'] = String(params.start);
    if (params.parentId !== undefined) q['parentId'] = String(params.parentId);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

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
  async bulkCreate2(params: { orgId: string; deviceId: string; allowUnknown?: boolean; delete?: boolean; start?: boolean; parentId?: string; body: BulkCreateRequest }, opts?: RequestOptions): Promise<{ createdCount?: number; deletedCount?: number; errors?: { index?: number; message?: string; nodeId?: string }[]; nodes?: Node[]; runtimeStarted?: boolean; skippedCount?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/bulk`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.allowUnknown !== undefined) q['allowUnknown'] = String(params.allowUnknown);
    if (params.delete !== undefined) q['delete'] = String(params.delete);
    if (params.start !== undefined) q['start'] = String(params.start);
    if (params.parentId !== undefined) q['parentId'] = String(params.parentId);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/nodes/bulk
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ deletedChildren?: number; deletedCount?: number; deletedNodes?: string[]; message?: string }>
   */
  async bulkDelete(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ deletedChildren?: number; deletedCount?: number; deletedNodes?: string[]; message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/bulk`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/nodes/bulk
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ errors?: { message?: string; nodeId?: string }[]; nodes?: Node[]; updatedCount?: number }>
   */
  async bulkUpdate(params: { orgId: string; deviceId: string; body: BulkUpdateNodesRequest }, opts?: RequestOptions): Promise<{ errors?: { message?: string; nodeId?: string }[]; nodes?: Node[]; updatedCount?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/bulk`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Execute a DELETE command (delete/clear operation)
   * @param params - Request parameters
   * @param params.async - Force async execution (returns jobId instead of result)
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async commandDelete(params: { orgId: string; deviceId: string; nodeId: string; commandName: string; async?: boolean }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/commands/{commandName}/execute`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{commandName}', encodeURIComponent(String(params.commandName)));
    const q: Record<string, string> = {};
    if (params.async !== undefined) q['async'] = String(params.async);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Execute a GET command (query/read operation, returns data synchronously). Query parameters are passed through to the command handler (e.g., ?token=abc&duration=5000).
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Record<string, unknown>>
   */
  async commandGet(params: { orgId: string; deviceId: string; nodeId: string; commandName: string }, opts?: RequestOptions): Promise<Record<string, unknown>> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/commands/{commandName}/execute`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{commandName}', encodeURIComponent(String(params.commandName)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Execute a PATCH command (update operation)
   * @param params - Request parameters
   * @param params.async - Force async execution (returns jobId instead of result)
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async commandPatch(params: { orgId: string; deviceId: string; nodeId: string; commandName: string; async?: boolean; body: Record<string, unknown> }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/commands/{commandName}/execute`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{commandName}', encodeURIComponent(String(params.commandName)));
    const q: Record<string, string> = {};
    if (params.async !== undefined) q['async'] = String(params.async);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'PATCH', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Execute a POST command (create/mutation operation)
   * @param params - Request parameters
   * @param params.async - Force async execution (returns jobId instead of result)
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async commandPost(params: { orgId: string; deviceId: string; nodeId: string; commandName: string; async?: boolean; body: Record<string, unknown> }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/commands/{commandName}/execute`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{commandName}', encodeURIComponent(String(params.commandName)));
    const q: Record<string, string> = {};
    if (params.async !== undefined) q['async'] = String(params.async);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Execute a command asynchronously (returns job ID)
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ jobId?: string }>
   */
  async commandRun(params: { orgId: string; deviceId: string; nodeId: string; body: { commandName?: string; parameters?: Record<string, unknown> } }, opts?: RequestOptions): Promise<{ jobId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/command-runs`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Execute multiple commands transactionally
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<BulkCommandResponse>
   */
  async commandRunBulk(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<BulkCommandResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/command-runs/bulk`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get a specific command definition including schema
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<CommandDefinition>
   */
  async commandsGet(params: { orgId: string; deviceId: string; nodeId: string; name: string }, opts?: RequestOptions): Promise<CommandDefinition> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/commands/{name}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{name}', encodeURIComponent(String(params.name)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List commands supported by a node
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<CommandDefinition[]>
   */
  async commandsList(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<CommandDefinition[]> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/commands`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/nodes
   * @param params - Request parameters
   * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
   * @param params.parentId - Parent node ID. Auto-creates parentRef. If omitted, uses orgId as parent.
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async create(params: { orgId: string; deviceId: string; allowUnknown?: boolean; parentId?: string; body: NodeCreate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.allowUnknown !== undefined) q['allowUnknown'] = String(params.allowUnknown);
    if (params.parentId !== undefined) q['parentId'] = String(params.parentId);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/nodes/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async delete(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/nodes
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async deleteAll(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Deploy CE nodes from Rubix database to Control Engine runtime
   * @param params - Request parameters
   * @param params.id - CE driver node ID (must be type drivers.control_engine)
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ duration?: string; edgesCreated?: number; edgesDeleted?: number; errors?: string[]; nodesCreated?: number; nodesDeleted?: number; nodesUpdated?: number; success?: boolean }>
   */
  async deploy(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<{ duration?: string; edgesCreated?: number; edgesDeleted?: number; errors?: string[]; nodesCreated?: number; nodesDeleted?: number; nodesUpdated?: number; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}/deploy`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nodes/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async get(params: { orgId: string; deviceId: string; id: string; includeValues?: boolean }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const q: Record<string, string> = {};
    if (params.includeValues !== undefined) q['includeValues'] = String(params.includeValues);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Cancel/delete a command job
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; success?: boolean }>
   */
  async jobsDelete(params: { orgId: string; deviceId: string; nodeId: string; jobId: string }, opts?: RequestOptions): Promise<{ message?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/jobs/{jobId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{jobId}', encodeURIComponent(String(params.jobId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get command job status and result
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<CommandJob>
   */
  async jobsGet(params: { orgId: string; deviceId: string; nodeId: string; jobId: string }, opts?: RequestOptions): Promise<CommandJob> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/jobs/{jobId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{jobId}', encodeURIComponent(String(params.jobId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List command jobs for a node
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<CommandJob[]>
   */
  async jobsList(params: { orgId: string; deviceId: string; nodeId: string; status?: 'pending' | 'running' | 'success' | 'failed' }, opts?: RequestOptions): Promise<CommandJob[]> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/jobs`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const q: Record<string, string> = {};
    if (params.status !== undefined) q['status'] = String(params.status);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nodes
   * @param params - Request parameters
   * @param params.type - Filter by node type (e.g., trigger.timer, core.counter)
   * @param params.tags - Additional tag filters as JSON
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NodeListResponse>
   */
  async list(params: { orgId: string; deviceId: string; type?: string; tags?: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<NodeListResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.type !== undefined) q['type'] = String(params.type);
    if (params.tags !== undefined) q['tags'] = String(params.tags);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Fast-path update for UI-only metadata (name, position, tags, data, ui) without stopping node processing
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async metadataUpdate(params: { orgId: string; deviceId: string; id: string; body: { data?: Record<string, unknown>; name?: string; position?: { x?: number; y?: number }; tags?: string[]; ui?: Record<string, unknown> } }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}/metadata`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PATCH', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get single port metadata (definition) - no value included
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ description?: string; handle?: string; id?: string; kind?: string; name?: string; type?: string }>
   */
  async portGet(params: { orgId: string; deviceId: string; nodeId: string; portId: string }, opts?: RequestOptions): Promise<{ description?: string; handle?: string; id?: string; kind?: string; name?: string; type?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/ports/{portId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portId}', encodeURIComponent(String(params.portId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Clear single port runtime value
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; success?: boolean }>
   */
  async portValueClear(params: { orgId: string; deviceId: string; nodeId: string; portId: string }, opts?: RequestOptions): Promise<{ message?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/port-values/{portId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portId}', encodeURIComponent(String(params.portId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get single port runtime value
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ timestamp?: string; type?: string; value?: any }>
   */
  async portValueGet(params: { orgId: string; deviceId: string; nodeId: string; portId: string }, opts?: RequestOptions): Promise<{ timestamp?: string; type?: string; value?: any }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/port-values/{portId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portId}', encodeURIComponent(String(params.portId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Set single port runtime value. Use ?setOutput=true to write directly to output ports using SetOutputPortValue (bypasses processing, useful for polling nodes updating entity ports).
   * @param params - Request parameters
   * @param params.setOutput - If true, uses SetOutputPortValue for direct output port write (bypasses processing). If false, uses EmitValue (normal flow processing).
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ method?: string; nodeId?: string; portId?: string; success?: boolean; timestamp?: string; value?: any }>
   */
  async portValueSet(params: { orgId: string; deviceId: string; nodeId: string; portId: string; setOutput?: boolean; body: { dataType?: string; value?: any } }, opts?: RequestOptions): Promise<{ method?: string; nodeId?: string; portId?: string; success?: boolean; timestamp?: string; value?: any }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/port-values/{portId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portId}', encodeURIComponent(String(params.portId)));
    const q: Record<string, string> = {};
    if (params.setOutput !== undefined) q['setOutput'] = String(params.setOutput);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all port values for a node (inputs and outputs)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NodePortValuesResponse>
   */
  async portValuesList(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<NodePortValuesResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/port-values`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all port metadata (definitions) for a node - no values included
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ inputs?: { description?: string; disablePort?: boolean; enumId?: string; handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; id?: string; isOverridden?: boolean; kind?: string; name?: string; nodeId?: string; quantity?: string; required?: boolean; type?: string; unit?: string }[]; nodeId?: string; outputs?: { description?: string; disablePort?: boolean; enumId?: string; handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; id?: string; isOverridden?: boolean; kind?: string; name?: string; nodeId?: string; quantity?: string; required?: boolean; type?: string; unit?: string }[] }>
   */
  async portsList(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<{ inputs?: { description?: string; disablePort?: boolean; enumId?: string; handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; id?: string; isOverridden?: boolean; kind?: string; name?: string; nodeId?: string; quantity?: string; required?: boolean; type?: string; unit?: string }[]; nodeId?: string; outputs?: { description?: string; disablePort?: boolean; enumId?: string; handle?: string; historyEnabled?: boolean; historyInterval?: number; historyPolicy?: string; historyThreshold?: number; id?: string; isOverridden?: boolean; kind?: string; name?: string; nodeId?: string; quantity?: string; required?: boolean; type?: string; unit?: string }[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/ports`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get node settings (current values only)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ settings?: Record<string, unknown> }>
   */
  async settings(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<{ settings?: Record<string, unknown> }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}/settings`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PATCH /orgs/{orgId}/devices/{deviceId}/nodes/{id}/settings
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ node?: Node; settings?: Record<string, unknown> }>
   */
  async settingsPatch(params: { orgId: string; deviceId: string; id: string; body: Record<string, unknown> }, opts?: RequestOptions): Promise<{ node?: Node; settings?: Record<string, unknown> }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}/settings`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PATCH', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/nodes/{id}/settings
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ node?: Node; settings?: Record<string, unknown> }>
   */
  async settingsUpdate(params: { orgId: string; deviceId: string; id: string; body: Record<string, unknown> }, opts?: RequestOptions): Promise<{ node?: Node; settings?: Record<string, unknown> }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}/settings`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get node settings schema combined with current values (optimized for settings UI)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NodeSettingsSchemaResponse>
   */
  async settingsWithSchema(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<NodeSettingsSchemaResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}/settings-schema`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/nodes/{id}/trigger
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async trigger(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}/trigger`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/nodes/{id}
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async update(params: { orgId: string; deviceId: string; id: string; body: NodeUpdate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update a node's ID and all references to it (refs and edges). Atomic operation.
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; newNodeId?: string; node?: Node; oldNodeId?: string; success?: boolean }>
   */
  async updateId(params: { orgId: string; deviceId: string; id: string; body: { newNodeId?: string } }, opts?: RequestOptions): Promise<{ message?: string; newNodeId?: string; node?: Node; oldNodeId?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{id}/update-id`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PATCH', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class NodesHierarchyClient extends BaseClient {
  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/ancestors
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node[]>
   */
  async getancestors(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<Node[]> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/ancestors`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/children
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node[]>
   */
  async getchildren(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<Node[]> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/children`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/descendants
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node[]>
   */
  async getdescendants(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<Node[]> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/descendants`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/family
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ children?: Node[]; parent?: Node }>
   */
  async getfamily(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<{ children?: Node[]; parent?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/family`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/parent
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async getparent(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/parent`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tree
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ children?: Node[]; root?: Node }>
   */
  async gettree(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<{ children?: Node[]; root?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tree`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class NodesPagesClient extends BaseClient {
  /**
   * Attach a page to a node via pageRef
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: { default?: boolean; nodeId?: string; order?: number; pageId?: string; refId?: string }; message?: string }>
   */
  async attach(params: { orgId: string; deviceId: string; nodeId: string; pageId: string }, opts?: RequestOptions): Promise<{ data?: { default?: boolean; nodeId?: string; order?: number; pageId?: string; refId?: string }; message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/pages/{pageId}/attach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Detach a page from a node (delete pageRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async detach(params: { orgId: string; deviceId: string; nodeId: string; pageId: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/pages/{pageId}/detach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all available pages for a node (pallet + custom via pageRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: { description?: string; icon?: string; isDefault?: boolean; nodeId?: string; order?: number; pageId?: string; route?: string; source?: string; title?: string }[]; meta?: { count?: number; nodeId?: string; nodeType?: string } }>
   */
  async getNodePages(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<{ data?: { description?: string; icon?: string; isDefault?: boolean; nodeId?: string; order?: number; pageId?: string; route?: string; source?: string; title?: string }[]; meta?: { count?: number; nodeId?: string; nodeType?: string } }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/pages`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Resolve a page configuration with context
   * @param params - Request parameters
   * @param params.nodeId - Context node ID for resolution
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ context?: Record<string, unknown>; icon?: string; pageId?: string; route?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { config?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { config?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }>
   */
  async resolve(params: { orgId: string; deviceId: string; pageId: string; nodeId?: string }, opts?: RequestOptions): Promise<{ context?: Record<string, unknown>; icon?: string; pageId?: string; route?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { config?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { config?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/resolve`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const q: Record<string, string> = {};
    if (params.nodeId !== undefined) q['nodeId'] = String(params.nodeId);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class NodesPagesAttachClient extends BaseClient {
  /**
   * Attach a page to a node via pageRef
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ isDefault?: boolean; message?: string; nodeId?: string; order?: number; pageId?: string; refId?: string }>
   */
  async attach(params: { orgId: string; deviceId: string; nodeId: string; pageId: string; body: { isDefault?: boolean; metadata?: Record<string, unknown>; order?: number } }, opts?: RequestOptions): Promise<{ isDefault?: boolean; message?: string; nodeId?: string; order?: number; pageId?: string; refId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/pages/{pageId}/attach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Detach a page from a node (delete pageRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; nodeId?: string; pageId?: string }>
   */
  async detach(params: { orgId: string; deviceId: string; nodeId: string; pageId: string }, opts?: RequestOptions): Promise<{ message?: string; nodeId?: string; pageId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/pages/{pageId}/detach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class NodesRelationshipsClient extends BaseClient {
  /**
   * Get all relationships for a node (pages, widgets, parent, children, etc.)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ nodeId?: string; nodeName?: string; nodeType?: string; relationships?: Record<string, unknown> }>
   */
  async get(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<{ nodeId?: string; nodeName?: string; nodeType?: string; relationships?: Record<string, unknown> }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/relationships`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class NodesValidateRelationshipsClient extends BaseClient {
  /**
   * Validate all relationships for a node
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }>
   */
  async validate(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/validate-relationships`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class OrgAdminClient extends BaseClient {
  /**
   * POST /orgs/{orgId}/devices/{deviceId}/admin/devices/{nodeId}/approve
   * @param params - Request parameters
   * @param params.nodeId - Node ID of the discovered device
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; nodeId?: string; success?: boolean }>
   */
  async approveDevice(params: { orgId: string; deviceId: string; nodeId: string; body: { approvalReason?: string } }, opts?: RequestOptions): Promise<{ message?: string; nodeId?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/devices/{nodeId}/approve`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/admin/blacklist
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ blacklistId?: string; message?: string; success?: boolean }>
   */
  async blacklistDevice(params: { orgId: string; deviceId: string; body: { description?: string; reason?: string; revokeExistingAccess?: boolean; serialNumber?: string } }, opts?: RequestOptions): Promise<{ blacklistId?: string; message?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/blacklist`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/admin/orgs
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ flowId?: string; message?: string; name?: string; orgId?: string; success?: boolean }>
   */
  async createOrg(params: { orgId: string; deviceId: string; body: AdminOrgCreate }, opts?: RequestOptions): Promise<{ flowId?: string; message?: string; name?: string; orgId?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/orgs`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/admin/devices/{nodeId}/deny
   * @param params - Request parameters
   * @param params.nodeId - Node ID of the discovered device
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; nodeId?: string; success?: boolean }>
   */
  async denyDevice(params: { orgId: string; deviceId: string; nodeId: string; body: { denialReason?: string } }, opts?: RequestOptions): Promise<{ message?: string; nodeId?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/devices/{nodeId}/deny`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

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
  async discoverDevices(params: { orgId: string; deviceId: string; deviceObjectIdRange?: string; timeout?: number; add?: boolean; type?: string; rubixNetworkNodeId?: string }, opts?: RequestOptions): Promise<{ devices?: DiscoveredDevice[]; devicesAdded?: number; devicesFound?: number; flowId?: string; message?: string; networkNodeId?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/devices/discover`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.deviceObjectIdRange !== undefined) q['deviceObjectIdRange'] = String(params.deviceObjectIdRange);
    if (params.timeout !== undefined) q['timeout'] = String(params.timeout);
    if (params.add !== undefined) q['add'] = String(params.add);
    if (params.type !== undefined) q['type'] = String(params.type);
    if (params.rubixNetworkNodeId !== undefined) q['rubixNetworkNodeId'] = String(params.rubixNetworkNodeId);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/admin/config/connection
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ deviceRole?: string; natsGlobalUrl?: string; natsLocalUrl?: string; sources?: { natsGlobalUrl?: string; natsLocalUrl?: string }; supervisorDeviceId?: string; supervisorOrgId?: string }>
   */
  async getConnectionConfig(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ deviceRole?: string; natsGlobalUrl?: string; natsLocalUrl?: string; sources?: { natsGlobalUrl?: string; natsLocalUrl?: string }; supervisorDeviceId?: string; supervisorOrgId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/config/connection`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/admin/config
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ deviceObjectId?: number; hardwareModel?: string; hardwareVersion?: string; id?: string; orgId?: string; role?: string; runLocalServer?: boolean; serialNumber?: string }>
   */
  async getDeviceConfig(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ deviceObjectId?: number; hardwareModel?: string; hardwareVersion?: string; id?: string; orgId?: string; role?: string; runLocalServer?: boolean; serialNumber?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/config`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/admin/info
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ assignment?: { deviceId?: string; orgId?: string }; hardware?: { deviceObjectId?: number; model?: string; serialNumber?: string; version?: string }; software?: { role?: string; runLocalServer?: boolean } }>
   */
  async getDeviceInfo(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ assignment?: { deviceId?: string; orgId?: string }; hardware?: { deviceObjectId?: number; model?: string; serialNumber?: string; version?: string }; software?: { role?: string; runLocalServer?: boolean } }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/info`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/admin/blacklist
   * @param params - Request parameters
   * @param params.activeOnly - Only show active blacklist entries
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: DeviceBlacklist[]; meta?: { limit?: number; offset?: number; total?: number } }>
   */
  async listBlacklist(params: { orgId: string; deviceId: string; activeOnly?: boolean; limit?: number; offset?: number }, opts?: RequestOptions): Promise<{ data?: DeviceBlacklist[]; meta?: { limit?: number; offset?: number; total?: number } }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/blacklist`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.activeOnly !== undefined) q['activeOnly'] = String(params.activeOnly);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/admin/devices/discovered
   * @param params - Request parameters
   * @param params.status - Filter by status: discovered, approved, denied, provisioned, or empty for all
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: DiscoveredDevice[]; meta?: { total?: number } }>
   */
  async listDiscovered(params: { orgId: string; deviceId: string; status?: string }, opts?: RequestOptions): Promise<{ data?: DiscoveredDevice[]; meta?: { total?: number } }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/devices/discovered`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.status !== undefined) q['status'] = String(params.status);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/admin/orgs
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ orgs?: { createdAt?: string; description?: string; flowId?: string; id?: string; name?: string; orgId?: string; status?: string; updatedAt?: string }[]; total?: number }>
   */
  async listOrgs(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ orgs?: { createdAt?: string; description?: string; flowId?: string; id?: string; name?: string; orgId?: string; status?: string; updatedAt?: string }[]; total?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/orgs`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/admin/devices/provisioned
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node[]; meta?: { total?: number } }>
   */
  async listProvisioned(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ data?: Node[]; meta?: { total?: number } }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/devices/provisioned`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/admin/devices/provision
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<ProvisionResponse>
   */
  async provisionDevice(params: { orgId: string; deviceId: string; body: ProvisionRequest }, opts?: RequestOptions): Promise<ProvisionResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/devices/provision`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/admin/blacklist/{blacklistId}
   * @param params - Request parameters
   * @param params.blacklistId - Blacklist entry ID to remove
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; success?: boolean }>
   */
  async removeFromBlacklist(params: { orgId: string; deviceId: string; blacklistId: string }, opts?: RequestOptions): Promise<{ message?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/blacklist/{blacklistId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{blacklistId}', encodeURIComponent(String(params.blacklistId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/admin/devices/{serialNumber}/unprovision
   * @param params - Request parameters
   * @param params.serialNumber - Serial number of device to unprovision
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async unprovisionDevice(params: { orgId: string; deviceId: string; serialNumber: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/devices/{serialNumber}/unprovision`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{serialNumber}', encodeURIComponent(String(params.serialNumber)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PATCH /orgs/{orgId}/devices/{deviceId}/admin/config/connection
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; success?: boolean }>
   */
  async updateConnectionConfig(params: { orgId: string; deviceId: string; body: { deviceRole?: 'supervisor-device' | 'gateway-device' | 'field-device'; natsGlobalUrl?: string; natsLocalUrl?: string; supervisorDeviceId?: string; supervisorOrgId?: string } }, opts?: RequestOptions): Promise<{ message?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/config/connection`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'PATCH', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/admin/config/role
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; role?: string; success?: boolean }>
   */
  async updateDeviceRole(params: { orgId: string; deviceId: string; body: { role?: 'supervisor-device' | 'field-device' | 'gateway-device' } }, opts?: RequestOptions): Promise<{ message?: string; role?: string; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/admin/config/role`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class OrgsClient extends BaseClient {
  /**
   * POST /orgs
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async create(params: { body: OrgCreate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async delete(params: { id: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{id}`;
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async get(params: { id: string }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{id}`;
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get organization favicon (returns image file)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async getFavicon(params: { orgId: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/settings/favicon`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get comprehensive organization information including root device, networks, and devices
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<OrgInfo>
   */
  async getInfo(params: { id: string }, opts?: RequestOptions): Promise<OrgInfo> {
    let url = this.baseURL + `/orgs/{id}/info`;
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get organization logo (returns image file)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async getLogo(params: { orgId: string; variant?: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/settings/logo`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const q: Record<string, string> = {};
    if (params.variant !== undefined) q['variant'] = String(params.variant);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node[]; meta?: { total?: number } }>
   */
  async list(params: {  }, opts?: RequestOptions): Promise<{ data?: Node[]; meta?: { total?: number } }> {
    let url = this.baseURL + `/orgs`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{id}
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<Node>
   */
  async update(params: { id: string; body: OrgUpdate }, opts?: RequestOptions): Promise<Node> {
    let url = this.baseURL + `/orgs/{id}`;
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Upload organization logo
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async uploadLogo(params: { orgId: string; body: { logoBase64?: string; variant?: string } }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/settings/logo`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PagesClient extends BaseClient {
  /**
   * Attach a tab to a page via tabRef
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: { order?: number; pageId?: string; refId?: string; tabId?: string }; message?: string }>
   */
  async attachTab(params: { orgId: string; deviceId: string; pageId: string; tabId: string; body: { isActive?: boolean; order?: number } }, opts?: RequestOptions): Promise<{ data?: { order?: number; pageId?: string; refId?: string; tabId?: string }; message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/tabs/{tabId}/attach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    url = url.replace('{tabId}', encodeURIComponent(String(params.tabId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /orgs/{orgId}/devices/{deviceId}/pages
   * @param params - Request parameters
   * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node }>
   */
  async create(params: { orgId: string; deviceId: string; allowUnknown?: boolean; body: NodeCreate }, opts?: RequestOptions): Promise<{ data?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.allowUnknown !== undefined) q['allowUnknown'] = String(params.allowUnknown);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/pages/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; pageId?: string }>
   */
  async delete(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<{ message?: string; pageId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Detach a tab from a page (delete tabRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async detachTab(params: { orgId: string; deviceId: string; pageId: string; tabId: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/tabs/{tabId}/detach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    url = url.replace('{tabId}', encodeURIComponent(String(params.tabId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/pages/{id}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node }>
   */
  async get(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<{ data?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/pages
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node[]; meta?: { total?: number } }>
   */
  async list(params: { orgId?: string; deviceId?: string }, opts?: RequestOptions): Promise<{ data?: Node[]; meta?: { total?: number } }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all tabs attached to a page via tabRef
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: { icon?: string; isActive?: boolean; order?: number; refId?: string; tabId?: string; tabName?: string; title?: string }[]; meta?: { count?: number; pageId?: string } }>
   */
  async listPageTabs(params: { orgId: string; deviceId: string; pageId: string }, opts?: RequestOptions): Promise<{ data?: { icon?: string; isActive?: boolean; order?: number; refId?: string; tabId?: string; tabName?: string; title?: string }[]; meta?: { count?: number; pageId?: string } }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/tabs`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Resolve a complete page configuration with all templates and widgets. Supports context substitution via query params.
   * @param params - Request parameters
   * @param params.context - Context variables for resolution (?context[key]=value or ?nodeId=value)
   * @param params.resolveWidgets - If true, fully resolves all widgets with their data (haystack query results + runtime values). If false (default), returns only widget metadata.
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ context?: Record<string, unknown>; icon?: string; pageId?: string; route?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }>
   */
  async resolve(params: { orgId: string; deviceId: string; pageId: string; context?: Record<string, unknown>; resolveWidgets?: boolean }, opts?: RequestOptions): Promise<{ context?: Record<string, unknown>; icon?: string; pageId?: string; route?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/resolve`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const q: Record<string, string> = {};
    if (params.context !== undefined) q['context'] = String(params.context);
    if (params.resolveWidgets !== undefined) q['resolveWidgets'] = String(params.resolveWidgets);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Resolve a complete page configuration with all templates and widgets. Supports context substitution via JSON body.
   * @param params - Request parameters
   * @param params.resolveWidgets - If true, fully resolves all widgets with their data (haystack query results + runtime values). If false (default), returns only widget metadata.
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ context?: Record<string, unknown>; icon?: string; pageId?: string; route?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }>
   */
  async resolvePost(params: { orgId: string; deviceId: string; pageId: string; resolveWidgets?: boolean; body: { context?: Record<string, unknown> } }, opts?: RequestOptions): Promise<{ context?: Record<string, unknown>; icon?: string; pageId?: string; route?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { component?: string; config?: Record<string, unknown>; data?: Record<string, unknown>[]; dataCount?: number; description?: string; name?: string; nodeData?: Record<string, unknown>; order?: number; query?: string; queryRuntime?: boolean; size?: string; source?: string; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/resolve`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const q: Record<string, string> = {};
    if (params.resolveWidgets !== undefined) q['resolveWidgets'] = String(params.resolveWidgets);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Resolve a complete tab configuration with all templates and widgets. Supports context substitution via JSON body.
   * @param params - Request parameters
   * @param params.resolveWidgets - If true, fully resolves all widgets with their data (haystack query results + runtime values). If false (default), returns only widget metadata.
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ context?: Record<string, unknown>; icon?: string; isActive?: boolean; order?: number; tabId?: string; tabName?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { config?: Record<string, unknown>; nodeData?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { config?: Record<string, unknown>; nodeData?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }>
   */
  async resolveTabPost(params: { orgId: string; deviceId: string; tabId: string; resolveWidgets?: boolean; body: { context?: Record<string, unknown> } }, opts?: RequestOptions): Promise<{ context?: Record<string, unknown>; icon?: string; isActive?: boolean; order?: number; tabId?: string; tabName?: string; templates?: { config?: Record<string, unknown>; layoutType?: string; templateId?: string; widgets?: { config?: Record<string, unknown>; nodeData?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[]; zones?: string[] }[]; title?: string; widgets?: { config?: Record<string, unknown>; nodeData?: Record<string, unknown>; order?: number; title?: string; widgetId?: string; widgetType?: string; zone?: string }[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/tabs/{tabId}/resolve`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{tabId}', encodeURIComponent(String(params.tabId)));
    const q: Record<string, string> = {};
    if (params.resolveWidgets !== undefined) q['resolveWidgets'] = String(params.resolveWidgets);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/pages/{id}
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node }>
   */
  async update(params: { orgId: string; deviceId: string; id: string; body: NodeUpdate }, opts?: RequestOptions): Promise<{ data?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Validate a page configuration for errors (e.g., circular references, missing widgets)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ errors?: { code?: string; field?: string; message?: string }[]; valid?: boolean }>
   */
  async validate(params: { orgId: string; deviceId: string; pageId: string }, opts?: RequestOptions): Promise<{ errors?: { code?: string; field?: string; message?: string }[]; valid?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/validate`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PagesStructureClient extends BaseClient {
  /**
   * Get complete page structure (templates + widgets)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ page?: PageStructureNode; templates?: PageStructureNode[]; widgets?: PageStructureNode[] }>
   */
  async get(params: { orgId: string; deviceId: string; pageId: string }, opts?: RequestOptions): Promise<{ page?: PageStructureNode; templates?: PageStructureNode[]; widgets?: PageStructureNode[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/structure`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PagesTemplatesAttachClient extends BaseClient {
  /**
   * Attach a template to a page via templateRef
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; order?: number; pageId?: string; refId?: string; templateId?: string }>
   */
  async attach(params: { orgId: string; deviceId: string; pageId: string; templateId: string; body: { order?: number } }, opts?: RequestOptions): Promise<{ message?: string; order?: number; pageId?: string; refId?: string; templateId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/templates/{templateId}/attach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    url = url.replace('{templateId}', encodeURIComponent(String(params.templateId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Detach a template from a page (delete templateRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; pageId?: string; templateId?: string }>
   */
  async detach(params: { orgId: string; deviceId: string; pageId: string; templateId: string }, opts?: RequestOptions): Promise<{ message?: string; pageId?: string; templateId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/templates/{templateId}/detach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    url = url.replace('{templateId}', encodeURIComponent(String(params.templateId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all templates attached to a page
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ count?: number; pageId?: string; templates?: Record<string, unknown>[] }>
   */
  async list(params: { orgId: string; deviceId: string; pageId: string }, opts?: RequestOptions): Promise<{ count?: number; pageId?: string; templates?: Record<string, unknown>[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/templates`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PagesUsageClient extends BaseClient {
  /**
   * Find all nodes that use this page
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ resourceId?: string; resourceName?: string; resourceType?: string; usageCount?: number; usedBy?: unknown[] }>
   */
  async get(params: { orgId: string; deviceId: string; pageId: string }, opts?: RequestOptions): Promise<{ resourceId?: string; resourceName?: string; resourceType?: string; usageCount?: number; usedBy?: unknown[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/usage`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PagesValidateClient extends BaseClient {
  /**
   * Validate a page configuration (check for broken refs, circular deps)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }>
   */
  async validate(params: { orgId: string; deviceId: string; pageId: string }, opts?: RequestOptions): Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/validate`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PagesWidgetsAttachClient extends BaseClient {
  /**
   * Attach a widget to a page via widgetRef
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; order?: number; pageId?: string; refId?: string; slot?: string; widgetId?: string }>
   */
  async attach(params: { orgId: string; deviceId: string; pageId: string; widgetId: string; body: { order?: number; overrides?: Record<string, unknown>; slot?: string } }, opts?: RequestOptions): Promise<{ message?: string; order?: number; pageId?: string; refId?: string; slot?: string; widgetId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/widgets/{widgetId}/attach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    url = url.replace('{widgetId}', encodeURIComponent(String(params.widgetId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Detach a widget from a page (delete widgetRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; pageId?: string; widgetId?: string }>
   */
  async detach(params: { orgId: string; deviceId: string; pageId: string; widgetId: string }, opts?: RequestOptions): Promise<{ message?: string; pageId?: string; widgetId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/widgets/{widgetId}/detach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    url = url.replace('{widgetId}', encodeURIComponent(String(params.widgetId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all widgets attached to a page
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ count?: number; pageId?: string; widgets?: Record<string, unknown>[] }>
   */
  async list(params: { orgId: string; deviceId: string; pageId: string }, opts?: RequestOptions): Promise<{ count?: number; pageId?: string; widgets?: Record<string, unknown>[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/widgets`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update the order of a widget within a page
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; order?: number; pageId?: string; widgetId?: string }>
   */
  async reorder(params: { orgId: string; deviceId: string; pageId: string; widgetId: string; body: { order?: number } }, opts?: RequestOptions): Promise<{ message?: string; order?: number; pageId?: string; widgetId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pages/{pageId}/widgets/{widgetId}/reorder`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pageId}', encodeURIComponent(String(params.pageId)));
    url = url.replace('{widgetId}', encodeURIComponent(String(params.widgetId)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PalletClient extends BaseClient {
  /**
   * Get detailed information about a specific node type including its ports and settings
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async get(params: { orgId: string; deviceId: string; nodeType: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pallet/{nodeType}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeType}', encodeURIComponent(String(params.nodeType)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all available node types that can be created
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async list(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/pallet`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PingClient extends BaseClient {
  /**
   * GET /orgs/{orgId}/devices/{deviceId}/ping
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async status(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ping`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PluginsClient extends BaseClient {
  /**
   * Get plugin metadata
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<PluginMetadata>
   */
  async get(params: { orgId: string; deviceId: string; pluginId: string }, opts?: RequestOptions): Promise<PluginMetadata> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/plugins/{pluginId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pluginId}', encodeURIComponent(String(params.pluginId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all discovered plugins with runtime status and stats
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<PluginListResponse>
   */
  async list(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<PluginListResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/plugins`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Ping plugin to check if it's alive and responsive via NATS RPC
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ details?: { nodeId?: string; status?: string; version?: string }; error?: string; nodeId?: string; status?: string; success?: boolean; version?: string }>
   */
  async ping(params: { orgId: string; deviceId: string; pluginId: string }, opts?: RequestOptions): Promise<{ details?: { nodeId?: string; status?: string; version?: string }; error?: string; nodeId?: string; status?: string; success?: boolean; version?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/plugins/{pluginId}/ping`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pluginId}', encodeURIComponent(String(params.pluginId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Start plugin process
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; pluginId?: string; status?: string }>
   */
  async start(params: { orgId: string; deviceId: string; pluginId: string }, opts?: RequestOptions): Promise<{ message?: string; pluginId?: string; status?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/plugins/{pluginId}/start`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pluginId}', encodeURIComponent(String(params.pluginId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get plugin runtime status (instance info)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<PluginInstance>
   */
  async status(params: { orgId: string; deviceId: string; pluginId: string }, opts?: RequestOptions): Promise<PluginInstance> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/plugins/{pluginId}/status`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pluginId}', encodeURIComponent(String(params.pluginId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Stop plugin process
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; pluginId?: string; status?: string }>
   */
  async stop(params: { orgId: string; deviceId: string; pluginId: string }, opts?: RequestOptions): Promise<{ message?: string; pluginId?: string; status?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/plugins/{pluginId}/stop`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{pluginId}', encodeURIComponent(String(params.pluginId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PortMappingsClient extends BaseClient {
  /**
   * Disable a port mapping (stops publishing)
   * @param params - Request parameters
   * @param params.mappingId - Port mapping ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string }>
   */
  async disableMapping(params: { orgId: string; deviceId: string; mappingId: string }, opts?: RequestOptions): Promise<{ message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/port-mappings/{mappingId}/disable`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{mappingId}', encodeURIComponent(String(params.mappingId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Enable a disabled port mapping
   * @param params - Request parameters
   * @param params.mappingId - Port mapping ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string }>
   */
  async enableMapping(params: { orgId: string; deviceId: string; mappingId: string }, opts?: RequestOptions): Promise<{ message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/port-mappings/{mappingId}/enable`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{mappingId}', encodeURIComponent(String(params.mappingId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Expose a port to NATS network (local or global)
   * @param params - Request parameters
   * @param params.portId - Port ID (format nodeId-portHandle, e.g., "sensor-1-temperature")
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<PortMapping>
   */
  async exposePort(params: { orgId: string; deviceId: string; portId: string; body: { description?: string; fallbackValue?: any; fallbackValueType?: string; name?: string; network?: 'local' | 'global'; tags?: string[] } }, opts?: RequestOptions): Promise<PortMapping> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ports/{portId}/expose`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{portId}', encodeURIComponent(String(params.portId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get a specific port mapping by ID
   * @param params - Request parameters
   * @param params.mappingId - Port mapping ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<PortMapping>
   */
  async getPortMapping(params: { orgId: string; deviceId: string; mappingId: string }, opts?: RequestOptions): Promise<PortMapping> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/port-mappings/{mappingId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{mappingId}', encodeURIComponent(String(params.mappingId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all exposed ports across all devices in org (for discovery)
   * @param params - Request parameters
   * @param params.network - Optional filter by network type
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<PortMapping[]>
   */
  async listExposedPorts(params: { orgId: string; network?: 'local' | 'global' }, opts?: RequestOptions): Promise<PortMapping[]> {
    let url = this.baseURL + `/orgs/{orgId}/port-mappings/exposed`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    const q: Record<string, string> = {};
    if (params.network !== undefined) q['network'] = String(params.network);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all port mappings (exposed ports) for a device
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<PortMapping[]>
   */
  async listPortMappings(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<PortMapping[]> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/port-mappings`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all port subscriptions for a device
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<PortSubscription[]>
   */
  async listPortSubscriptions(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<PortSubscription[]> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/port-subscriptions`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Subscribe a port to an exposed port (receive NATS messages)
   * @param params - Request parameters
   * @param params.portId - Target port ID (format nodeId-portHandle)
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<PortSubscription>
   */
  async subscribeToPort(params: { orgId: string; deviceId: string; portId: string; body: { mappingId?: string; network?: 'local' | 'global'; subscriberDeviceId?: string; subscriberNodeId?: string; subscriberPortId?: string } }, opts?: RequestOptions): Promise<PortSubscription> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ports/{portId}/subscribe`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{portId}', encodeURIComponent(String(params.portId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Remove port exposure (stop publishing to NATS)
   * @param params - Request parameters
   * @param params.mappingId - Port mapping ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string }>
   */
  async unexposePort(params: { orgId: string; deviceId: string; mappingId: string }, opts?: RequestOptions): Promise<{ message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/port-mappings/{mappingId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{mappingId}', encodeURIComponent(String(params.mappingId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Unsubscribe from an exposed port (stop receiving messages)
   * @param params - Request parameters
   * @param params.subscriptionId - Port subscription ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string }>
   */
  async unsubscribeFromPort(params: { orgId: string; deviceId: string; subscriptionId: string }, opts?: RequestOptions): Promise<{ message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/port-subscriptions/{subscriptionId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{subscriptionId}', encodeURIComponent(String(params.subscriptionId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update port mapping settings (name, description, tags, fallback)
   * @param params - Request parameters
   * @param params.mappingId - Port mapping ID
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string }>
   */
  async updateMapping(params: { orgId: string; deviceId: string; mappingId: string; body: { description?: string; fallbackValue?: any; fallbackValueType?: string; name?: string; tags?: string[] } }, opts?: RequestOptions): Promise<{ message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/port-mappings/{mappingId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{mappingId}', encodeURIComponent(String(params.mappingId)));
    const req: HttpRequest = { method: 'PATCH', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PortsClient extends BaseClient {
  /**
   * Clear the override for a port
   * @param params - Request parameters
   * @param params.nodeId - Node ID
   * @param params.portHandle - Port handle (e.g., "out", "in", "increment")
   * @param params.cancelJob - Cancel timeout job if exists
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ port?: { id?: string; isOverridden?: boolean }; success?: boolean }>
   */
  async clearOverride(params: { orgId: string; deviceId: string; nodeId: string; portHandle: string; cancelJob?: boolean }, opts?: RequestOptions): Promise<{ port?: { id?: string; isOverridden?: boolean }; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ports/{nodeId}/{portHandle}/override`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portHandle}', encodeURIComponent(String(params.portHandle)));
    const q: Record<string, string> = {};
    if (params.cancelJob !== undefined) q['cancelJob'] = String(params.cancelJob);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Disable a port
   * @param params - Request parameters
   * @param params.nodeId - Node ID
   * @param params.portHandle - Port handle (e.g., "out", "in", "increment")
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ port?: { disablePort?: boolean; id?: string }; success?: boolean }>
   */
  async disable(params: { orgId: string; deviceId: string; nodeId: string; portHandle: string }, opts?: RequestOptions): Promise<{ port?: { disablePort?: boolean; id?: string }; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ports/{nodeId}/{portHandle}/disable`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portHandle}', encodeURIComponent(String(params.portHandle)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Enable a port
   * @param params - Request parameters
   * @param params.nodeId - Node ID
   * @param params.portHandle - Port handle (e.g., "out", "in", "increment")
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ port?: { disablePort?: boolean; id?: string }; success?: boolean }>
   */
  async enable(params: { orgId: string; deviceId: string; nodeId: string; portHandle: string }, opts?: RequestOptions): Promise<{ port?: { disablePort?: boolean; id?: string }; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ports/{nodeId}/{portHandle}/enable`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portHandle}', encodeURIComponent(String(params.portHandle)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get the override status for a port
   * @param params - Request parameters
   * @param params.nodeId - Node ID
   * @param params.portHandle - Port handle (e.g., "out", "in", "increment")
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ isDisabled?: boolean; isOverridden?: boolean; jobId?: string; jobStatus?: { enabled?: boolean; nextRunTime?: string }; overrideTimeout?: string; overrideValue?: any; timeRemaining?: string }>
   */
  async getOverrideStatus(params: { orgId: string; deviceId: string; nodeId: string; portHandle: string }, opts?: RequestOptions): Promise<{ isDisabled?: boolean; isOverridden?: boolean; jobId?: string; jobStatus?: { enabled?: boolean; nextRunTime?: string }; overrideTimeout?: string; overrideValue?: any; timeRemaining?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ports/{nodeId}/{portHandle}/override`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portHandle}', encodeURIComponent(String(params.portHandle)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all ports with complete status (metadata, values, override info, and history settings)
   * @param params - Request parameters
   * @param params.nodeId - Node ID
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<PortsWithStatusResponse>
   */
  async listWithStatus(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<PortsWithStatusResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/ports-with-status`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Set an override value for a port with optional timeout
   * @param params - Request parameters
   * @param params.nodeId - Node ID
   * @param params.portHandle - Port handle (e.g., "out", "in", "increment")
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ port?: { id?: string; isOverridden?: boolean; jobId?: string; overrideTimeout?: string; overrideValue?: any }; success?: boolean }>
   */
  async setOverride(params: { orgId: string; deviceId: string; nodeId: string; portHandle: string; body: { timeout?: string; timeoutAt?: string; value?: any } }, opts?: RequestOptions): Promise<{ port?: { id?: string; isOverridden?: boolean; jobId?: string; overrideTimeout?: string; overrideValue?: any }; success?: boolean }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ports/{nodeId}/{portHandle}/override`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{portHandle}', encodeURIComponent(String(params.portHandle)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class PublicDeviceClient extends BaseClient {
  /**
   * GET /public/health
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ service?: string; status?: string; timestamp?: string }>
   */
  async health(params: {  }, opts?: RequestOptions): Promise<{ service?: string; status?: string; timestamp?: string }> {
    let url = this.baseURL + `/public/health`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * POST /public/device/register
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ instructions?: { nextSteps?: string[] }; message?: string; nodeId?: string; status?: string; success?: boolean; supervisor?: { discoveryTopic?: string; natsURL?: string } }>
   */
  async register(params: { body: { deviceObjectId?: number; firmware?: string; hardwareModel?: string; hardwareVersion?: string; name?: string; role?: 'supervisor-device' | 'field-device' | 'gateway-device'; serialNumber?: string } }, opts?: RequestOptions): Promise<{ instructions?: { nextSteps?: string[] }; message?: string; nodeId?: string; status?: string; success?: boolean; supervisor?: { discoveryTopic?: string; natsURL?: string } }> {
    let url = this.baseURL + `/public/device/register`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /public/device/status/{serialNumber}
   * @param params - Request parameters
   * @param params.serialNumber - Device serial number to check status
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ approvalReason?: string; denialReason?: string; deviceId?: string; flowId?: string; nodeId?: string; orgId?: string; serialNumber?: string; status?: string }>
   */
  async status(params: { serialNumber: string }, opts?: RequestOptions): Promise<{ approvalReason?: string; denialReason?: string; deviceId?: string; flowId?: string; nodeId?: string; orgId?: string; serialNumber?: string; status?: string }> {
    let url = this.baseURL + `/public/device/status/{serialNumber}`;
    url = url.replace('{serialNumber}', encodeURIComponent(String(params.serialNumber)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class QueryClient extends BaseClient {
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
  async create(params: { orgId: string; deviceId: string; body: { filter?: string; limit?: number; offset?: number; ports?: string[]; runtime?: boolean } }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/query`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

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
  async filter(params: { orgId: string; deviceId: string; filter: string; runtime?: boolean; limit?: number; offset?: number; ports?: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/query`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.filter !== undefined) q['filter'] = String(params.filter);
    if (params.runtime !== undefined) q['runtime'] = String(params.runtime);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    if (params.ports !== undefined) q['ports'] = String(params.ports);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Query historical port values using Haystack filter with flexible date range support
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ nodes?: { nodeId?: string; nodeName?: string; portHandle?: string; samples?: { timestamp?: string; valueBool?: boolean; valueNum?: number; valueStr?: string }[] }[]; totalNodes?: number; totalSamples?: number }>
   */
  async history(params: { orgId: string; deviceId: string; body: { filter?: string; from?: string; limit?: number; portHandle?: string; range?: string; timeRange?: string; timezone?: string; to?: string } }, opts?: RequestOptions): Promise<{ nodes?: { nodeId?: string; nodeName?: string; portHandle?: string; samples?: { timestamp?: string; valueBool?: boolean; valueNum?: number; valueStr?: string }[] }[]; totalNodes?: number; totalSamples?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/query/history`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class RefsClient extends BaseClient {
  /**
   * Batch update order field for multiple refs atomically
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ success?: boolean; updatedCount?: number }>
   */
  async batchReorder(params: { orgId: string; deviceId: string; body: RefBatchReorderRequest }, opts?: RequestOptions): Promise<{ success?: boolean; updatedCount?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/refs/batch-reorder`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'PATCH', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Create or update a ref (upsert)
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<RefResponse>
   */
  async create(params: { orgId: string; deviceId: string; nodeId: string; body: RefCreate }, opts?: RequestOptions): Promise<RefResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/refs`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Delete a ref
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async delete(params: { orgId: string; deviceId: string; nodeId: string; refName: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/refs/{refName}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{refName}', encodeURIComponent(String(params.refName)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get a specific ref
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<RefResponse>
   */
  async get(params: { orgId: string; deviceId: string; nodeId: string; refName: string }, opts?: RequestOptions): Promise<RefResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/refs/{refName}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{refName}', encodeURIComponent(String(params.refName)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all refs from a node
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<RefListResponse>
   */
  async list(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<RefListResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/refs`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all nodes with a specific ref pointing to target (e.g., all devices in a site)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NodeListResponse>
   */
  async listByRef(params: { orgId: string; deviceId: string; refName: string; targetId: string }, opts?: RequestOptions): Promise<NodeListResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/refs/{refName}/{targetId}/nodes`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{refName}', encodeURIComponent(String(params.refName)));
    url = url.replace('{targetId}', encodeURIComponent(String(params.targetId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Reverse lookup: get all refs pointing TO this node
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<RefListResponse>
   */
  async listToNode(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<RefListResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/refs-to`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class RuntimeClient extends BaseClient {
  /**
   * Get all cached port values for all nodes in the runtime
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<RuntimeAllValuesResponse>
   */
  async getAllValues(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<RuntimeAllValuesResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/values`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get cached port values for a specific node
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<RuntimeNodeValuesResponse>
   */
  async getNodeValues(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<RuntimeNodeValuesResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/nodes/{nodeId}/values`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get cached port values for specific nodes (batch fetch to reduce payload size)
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<RuntimeAllValuesResponse>
   */
  async getValuesScoped(params: { orgId: string; deviceId: string; body: { nodeIds?: string[] } }, opts?: RequestOptions): Promise<RuntimeAllValuesResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/values/scoped`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get detailed status of which nodes loaded successfully (compares DB vs runtime)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ loadRate?: number; loadedCount?: number; loadedNodes?: { id?: string; name?: string; type?: string }[]; missingCount?: number; missingNodes?: { id?: string; name?: string; type?: string }[]; status?: 'healthy' | 'partial' | 'failed'; totalInDB?: number; totalInRuntime?: number }>
   */
  async nodeLoadStatus(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ loadRate?: number; loadedCount?: number; loadedNodes?: { id?: string; name?: string; type?: string }[]; missingCount?: number; missingNodes?: { id?: string; name?: string; type?: string }[]; status?: 'healthy' | 'partial' | 'failed'; totalInDB?: number; totalInRuntime?: number }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/node-load-status`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all available node types that can be created in runtime
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ nodeTypes?: { category?: string; description?: string; icon?: string; name?: string; type?: string }[] }>
   */
  async palletList(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ nodeTypes?: { category?: string; description?: string; icon?: string; name?: string; type?: string }[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/pallet`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Restart the runtime (stop then start)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; orgId?: string }>
   */
  async restart(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ message?: string; orgId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/restart`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get complete flow graph (nodes + edges) - Optimized single query
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ edges?: Edge[]; nodes?: Node[] }>
   */
  async snapshot(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ edges?: Edge[]; nodes?: Node[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/snapshot`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get flow graph scoped to a specific parent node (optimized for React Flow hierarchical navigation)
   * @param params - Request parameters
   * @param params.parentId - Parent node ID. If omitted, returns root nodes (nodes without parentRef)
   * @param params.includeOrphans - Include nodes without parent (orphaned nodes) when fetching root nodes
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ edges?: Edge[]; metadata?: { edgeCount?: number; hasChildren?: boolean; nodeCount?: number }; nodes?: Node[]; parentNode?: Node }>
   */
  async snapshotHierarchical(params: { orgId: string; deviceId: string; parentId?: string; includeOrphans?: boolean }, opts?: RequestOptions): Promise<{ edges?: Edge[]; metadata?: { edgeCount?: number; hasChildren?: boolean; nodeCount?: number }; nodes?: Node[]; parentNode?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/snapshot/hierarchical`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.parentId !== undefined) q['parentId'] = String(params.parentId);
    if (params.includeOrphans !== undefined) q['includeOrphans'] = String(params.includeOrphans);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Start the runtime for an organization
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; orgId?: string }>
   */
  async start(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ message?: string; orgId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/start`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get the runtime status
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ edgeCount?: number; nodeCount?: number; orgId?: string; status?: 'running' | 'stopped' | 'error' }>
   */
  async status(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ edgeCount?: number; nodeCount?: number; orgId?: string; status?: 'running' | 'stopped' | 'error' }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/status`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Stop the runtime for an organization
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; orgId?: string }>
   */
  async stop(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ message?: string; orgId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/runtime/stop`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class RxaiClient extends BaseClient {
  /**
   * Create a new rxai agent session
   * @param params - Request parameters
   * @param params.orgId - Organization ID
   * @param params.deviceId - Device ID
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async createSession(params: { orgId: string; deviceId: string; body: RxAICreateSessionRequest }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/rxai/sessions`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get session details
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async getSession(params: { orgId: string; deviceId: string; sessionId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/rxai/sessions/{sessionId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{sessionId}', encodeURIComponent(String(params.sessionId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all actions taken by the agent in a session
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async listActions(params: { orgId: string; deviceId: string; sessionId: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/rxai/sessions/{sessionId}/actions`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{sessionId}', encodeURIComponent(String(params.sessionId)));
    const q: Record<string, string> = {};
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all interactions in a session
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async listInteractions(params: { orgId: string; deviceId: string; sessionId: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/rxai/sessions/{sessionId}/interactions`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{sessionId}', encodeURIComponent(String(params.sessionId)));
    const q: Record<string, string> = {};
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

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
  async listSessions(params: { orgId: string; deviceId: string; status?: string; userId?: string; limit?: number; offset?: number }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/rxai/sessions`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.status !== undefined) q['status'] = String(params.status);
    if (params.userId !== undefined) q['userId'] = String(params.userId);
    if (params.limit !== undefined) q['limit'] = String(params.limit);
    if (params.offset !== undefined) q['offset'] = String(params.offset);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Send message to agent session
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async sendMessage(params: { orgId: string; deviceId: string; sessionId: string; body: RxAISendMessageRequest }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/rxai/sessions/{sessionId}/messages`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{sessionId}', encodeURIComponent(String(params.sessionId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Stop an active session
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async stopSession(params: { orgId: string; deviceId: string; sessionId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/rxai/sessions/{sessionId}/stop`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{sessionId}', encodeURIComponent(String(params.sessionId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class SchemasClient extends BaseClient {
  /**
   * Get JSON schema for a specific node type
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<SchemaResponse>
   */
  async get(params: { orgId: string; deviceId: string; nodeType: string }, opts?: RequestOptions): Promise<SchemaResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/node-types/{nodeType}/schema`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeType}', encodeURIComponent(String(params.nodeType)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get all available JSON schemas for node types
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<SchemasListResponse>
   */
  async list(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<SchemasListResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/node-types/schemas`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class TabsTemplatesAttachClient extends BaseClient {
  /**
   * Attach a template to a tab via templateRef
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; order?: number; refId?: string; tabId?: string; templateId?: string }>
   */
  async attach(params: { orgId: string; deviceId: string; tabId: string; templateId: string; body: { order?: number } }, opts?: RequestOptions): Promise<{ message?: string; order?: number; refId?: string; tabId?: string; templateId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/tabs/{tabId}/templates/{templateId}/attach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{tabId}', encodeURIComponent(String(params.tabId)));
    url = url.replace('{templateId}', encodeURIComponent(String(params.templateId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Detach a template from a tab (delete templateRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async detach(params: { orgId: string; deviceId: string; tabId: string; templateId: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/tabs/{tabId}/templates/{templateId}/detach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{tabId}', encodeURIComponent(String(params.tabId)));
    url = url.replace('{templateId}', encodeURIComponent(String(params.templateId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all templates attached to a tab
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ count?: number; tabId?: string; templates?: Record<string, unknown>[] }>
   */
  async list(params: { orgId: string; deviceId: string; tabId: string }, opts?: RequestOptions): Promise<{ count?: number; tabId?: string; templates?: Record<string, unknown>[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/tabs/{tabId}/templates`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{tabId}', encodeURIComponent(String(params.tabId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class TabsWidgetsAttachClient extends BaseClient {
  /**
   * Attach a widget to a tab via widgetRef
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; order?: number; refId?: string; slot?: string; tabId?: string; widgetId?: string }>
   */
  async attach(params: { orgId: string; deviceId: string; tabId: string; widgetId: string; body: { order?: number; overrides?: Record<string, unknown>; slot?: string } }, opts?: RequestOptions): Promise<{ message?: string; order?: number; refId?: string; slot?: string; tabId?: string; widgetId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/tabs/{tabId}/widgets/{widgetId}/attach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{tabId}', encodeURIComponent(String(params.tabId)));
    url = url.replace('{widgetId}', encodeURIComponent(String(params.widgetId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Detach a widget from a tab (delete widgetRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async detach(params: { orgId: string; deviceId: string; tabId: string; widgetId: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/tabs/{tabId}/widgets/{widgetId}/detach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{tabId}', encodeURIComponent(String(params.tabId)));
    url = url.replace('{widgetId}', encodeURIComponent(String(params.widgetId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all widgets attached to a tab
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ count?: number; tabId?: string; widgets?: Record<string, unknown>[] }>
   */
  async list(params: { orgId: string; deviceId: string; tabId: string }, opts?: RequestOptions): Promise<{ count?: number; tabId?: string; widgets?: Record<string, unknown>[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/tabs/{tabId}/widgets`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{tabId}', encodeURIComponent(String(params.tabId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class TagsClient extends BaseClient {
  /**
   * POST /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async create(params: { orgId: string; deviceId: string; nodeId: string; body: TagCreate }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * DELETE /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags/{tagName}
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async delete(params: { orgId: string; deviceId: string; nodeId: string; tagName: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags/{tagName}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{tagName}', encodeURIComponent(String(params.tagName)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * GET /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async list(params: { orgId: string; deviceId: string; nodeId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * PUT /orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags/{tagName}
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async update(params: { orgId: string; deviceId: string; nodeId: string; tagName: string; body: TagUpdate }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/nodes/{nodeId}/tags/{tagName}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{nodeId}', encodeURIComponent(String(params.nodeId)));
    url = url.replace('{tagName}', encodeURIComponent(String(params.tagName)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class TeamsClient extends BaseClient {
  /**
   * Add user to team
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async addUser(params: { orgId: string; deviceId: string; teamId: string; userId: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams/{teamId}/users/{userId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{teamId}', encodeURIComponent(String(params.teamId)));
    url = url.replace('{userId}', encodeURIComponent(String(params.userId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Assign navigation to team (creates navRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async assignNav(params: { orgId: string; deviceId: string; teamId: string; navId: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams/{teamId}/nav/{navId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{teamId}', encodeURIComponent(String(params.teamId)));
    url = url.replace('{navId}', encodeURIComponent(String(params.navId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Create a new team
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<TeamResponse>
   */
  async create(params: { orgId: string; deviceId: string; body: CreateTeamRequest }, opts?: RequestOptions): Promise<TeamResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Delete a team
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async delete(params: { orgId: string; deviceId: string; teamId: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams/{teamId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{teamId}', encodeURIComponent(String(params.teamId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get team details
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<TeamResponse>
   */
  async get(params: { orgId: string; deviceId: string; teamId: string }, opts?: RequestOptions): Promise<TeamResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams/{teamId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{teamId}', encodeURIComponent(String(params.teamId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get team's assigned navigation
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<NavTreeResponse>
   */
  async getNav(params: { orgId: string; deviceId: string; teamId: string }, opts?: RequestOptions): Promise<NavTreeResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams/{teamId}/nav`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{teamId}', encodeURIComponent(String(params.teamId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all teams in an organization
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<TeamsResponse>
   */
  async list(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<TeamsResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all users in a team
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<UsersResponse>
   */
  async listUsers(params: { orgId: string; deviceId: string; teamId: string }, opts?: RequestOptions): Promise<UsersResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams/{teamId}/users`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{teamId}', encodeURIComponent(String(params.teamId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Remove user from team
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async removeUser(params: { orgId: string; deviceId: string; teamId: string; userId: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams/{teamId}/users/{userId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{teamId}', encodeURIComponent(String(params.teamId)));
    url = url.replace('{userId}', encodeURIComponent(String(params.userId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Unassign navigation from team (removes navRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async unassignNav(params: { orgId: string; deviceId: string; teamId: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams/{teamId}/nav`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{teamId}', encodeURIComponent(String(params.teamId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update team details
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<TeamResponse>
   */
  async update(params: { orgId: string; deviceId: string; teamId: string; body: UpdateTeamRequest }, opts?: RequestOptions): Promise<TeamResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/teams/{teamId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{teamId}', encodeURIComponent(String(params.teamId)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class TemplatesClient extends BaseClient {
  /**
   * Create a new template
   * @param params - Request parameters
   * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node }>
   */
  async create(params: { orgId: string; deviceId: string; allowUnknown?: boolean; body: NodeCreate }, opts?: RequestOptions): Promise<{ data?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.allowUnknown !== undefined) q['allowUnknown'] = String(params.allowUnknown);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Delete a template
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ id?: string; message?: string }>
   */
  async delete(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<{ id?: string; message?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get a single template by ID
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node }>
   */
  async get(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<{ data?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all templates for an organization/device
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node[]; meta?: { total?: number } }>
   */
  async list(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ data?: Node[]; meta?: { total?: number } }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update an existing template
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node }>
   */
  async update(params: { orgId: string; deviceId: string; id: string; body: NodeUpdate }, opts?: RequestOptions): Promise<{ data?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class TemplatesUsageClient extends BaseClient {
  /**
   * Find all pages that use this template
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ resourceId?: string; resourceName?: string; resourceType?: string; usageCount?: number; usedBy?: unknown[] }>
   */
  async get(params: { orgId: string; deviceId: string; templateId: string }, opts?: RequestOptions): Promise<{ resourceId?: string; resourceName?: string; resourceType?: string; usageCount?: number; usedBy?: unknown[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates/{templateId}/usage`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{templateId}', encodeURIComponent(String(params.templateId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class TemplatesValidateClient extends BaseClient {
  /**
   * Validate a template configuration
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }>
   */
  async validate(params: { orgId: string; deviceId: string; templateId: string }, opts?: RequestOptions): Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates/{templateId}/validate`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{templateId}', encodeURIComponent(String(params.templateId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class TemplatesWidgetsAttachClient extends BaseClient {
  /**
   * Attach a widget to a template via widgetRef
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; order?: number; refId?: string; templateId?: string; widgetId?: string; zone?: string }>
   */
  async attach(params: { orgId: string; deviceId: string; templateId: string; widgetId: string; body: { order?: number; overrides?: Record<string, unknown>; zone?: string } }, opts?: RequestOptions): Promise<{ message?: string; order?: number; refId?: string; templateId?: string; widgetId?: string; zone?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates/{templateId}/widgets/{widgetId}/attach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{templateId}', encodeURIComponent(String(params.templateId)));
    url = url.replace('{widgetId}', encodeURIComponent(String(params.widgetId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Detach a widget from a template (delete widgetRef)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; templateId?: string; widgetId?: string }>
   */
  async detach(params: { orgId: string; deviceId: string; templateId: string; widgetId: string }, opts?: RequestOptions): Promise<{ message?: string; templateId?: string; widgetId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates/{templateId}/widgets/{widgetId}/detach`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{templateId}', encodeURIComponent(String(params.templateId)));
    url = url.replace('{widgetId}', encodeURIComponent(String(params.widgetId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all widgets attached to a template
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ count?: number; templateId?: string; widgets?: Record<string, unknown>[] }>
   */
  async list(params: { orgId: string; deviceId: string; templateId: string }, opts?: RequestOptions): Promise<{ count?: number; templateId?: string; widgets?: Record<string, unknown>[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates/{templateId}/widgets`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{templateId}', encodeURIComponent(String(params.templateId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update the order of a widget within a template
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ message?: string; order?: number; templateId?: string; widgetId?: string }>
   */
  async reorder(params: { orgId: string; deviceId: string; templateId: string; widgetId: string; body: { order?: number } }, opts?: RequestOptions): Promise<{ message?: string; order?: number; templateId?: string; widgetId?: string }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/templates/{templateId}/widgets/{widgetId}/reorder`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{templateId}', encodeURIComponent(String(params.templateId)));
    url = url.replace('{widgetId}', encodeURIComponent(String(params.widgetId)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class UsersClient extends BaseClient {
  /**
   * Delete a user
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<MessageResponse>
   */
  async delete(params: { orgId: string; deviceId: string; userId: string }, opts?: RequestOptions): Promise<MessageResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/users/{userId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{userId}', encodeURIComponent(String(params.userId)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get user details
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<UserResponse>
   */
  async get(params: { orgId: string; deviceId: string; userId: string; includeSettings?: boolean }, opts?: RequestOptions): Promise<UserResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/users/{userId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{userId}', encodeURIComponent(String(params.userId)));
    const q: Record<string, string> = {};
    if (params.includeSettings !== undefined) q['includeSettings'] = String(params.includeSettings);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Invite a new user to the organization
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<UserResponse>
   */
  async invite(params: { orgId: string; deviceId: string; body: InviteUserRequest }, opts?: RequestOptions): Promise<UserResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/users/invite`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all users in an organization
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<UsersResponse>
   */
  async list(params: { orgId: string; deviceId: string; includeSettings?: boolean }, opts?: RequestOptions): Promise<UsersResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/users`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.includeSettings !== undefined) q['includeSettings'] = String(params.includeSettings);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update user details
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<UserResponse>
   */
  async update(params: { orgId: string; deviceId: string; userId: string; body: UpdateUserRequest }, opts?: RequestOptions): Promise<UserResponse> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/users/{userId}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{userId}', encodeURIComponent(String(params.userId)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class ValidateAllRefsClient extends BaseClient {
  /**
   * Validate all refs in the system (find broken refs)
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }>
   */
  async validate(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/validate-all-refs`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class WidgetsClient extends BaseClient {
  /**
   * Create a new ui.widget node
   * @param params - Request parameters
   * @param params.allowUnknown - Allow creating nodes with unregistered types (sets category='unknown')
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node }>
   */
  async create(params: { orgId: string; deviceId: string; allowUnknown?: boolean; body: NodeCreate }, opts?: RequestOptions): Promise<{ data?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/widgets`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const q: Record<string, string> = {};
    if (params.allowUnknown !== undefined) q['allowUnknown'] = String(params.allowUnknown);
    const qs = buildQuery(q);
    if (qs) url += `?${qs}`;
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Delete a ui.widget node
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<unknown>
   */
  async delete(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<unknown> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/widgets/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'DELETE', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Get a specific ui.widget node
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node }>
   */
  async get(params: { orgId: string; deviceId: string; id: string }, opts?: RequestOptions): Promise<{ data?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/widgets/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * List all ui.widget nodes
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node[]; meta?: { total?: number } }>
   */
  async list(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<{ data?: Node[]; meta?: { total?: number } }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/widgets`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

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
  async resolve(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ui/widgets/resolve`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Resolve multiple widgets in a single request.
More efficient than calling resolve multiple times.

   * @param params - Request parameters
   * @param params.orgId - Organization ID
   * @param params.deviceId - Device ID for routing
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<any>
   */
  async resolveBatch(params: { orgId: string; deviceId: string }, opts?: RequestOptions): Promise<any> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/ui/widgets/resolve-batch`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    const req: HttpRequest = { method: 'POST', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

  /**
   * Update an existing ui.widget node
   * @param params - Request parameters
   * @param params.body - Request body
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ data?: Node }>
   */
  async update(params: { orgId: string; deviceId: string; id: string; body: NodeUpdate }, opts?: RequestOptions): Promise<{ data?: Node }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/widgets/{id}`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{id}', encodeURIComponent(String(params.id)));
    const req: HttpRequest = { method: 'PUT', url, headers: opts?.headers, body: (params as any).body, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class WidgetsUsageClient extends BaseClient {
  /**
   * Find all pages that use this widget
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ resourceId?: string; resourceName?: string; resourceType?: string; usageCount?: number; usedBy?: unknown[] }>
   */
  async get(params: { orgId: string; deviceId: string; widgetId: string }, opts?: RequestOptions): Promise<{ resourceId?: string; resourceName?: string; resourceType?: string; usageCount?: number; usedBy?: unknown[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/widgets/{widgetId}/usage`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{widgetId}', encodeURIComponent(String(params.widgetId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class WidgetsValidateClient extends BaseClient {
  /**
   * Validate a widget configuration
   * @param params - Request parameters
   * @param opts - Optional request options (headers, signal)
   * @returns Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }>
   */
  async validate(params: { orgId: string; deviceId: string; widgetId: string }, opts?: RequestOptions): Promise<{ errors?: unknown[]; valid?: boolean; warnings?: unknown[] }> {
    let url = this.baseURL + `/orgs/{orgId}/devices/{deviceId}/widgets/{widgetId}/validate`;
    url = url.replace('{orgId}', encodeURIComponent(String(params.orgId)));
    url = url.replace('{deviceId}', encodeURIComponent(String(params.deviceId)));
    url = url.replace('{widgetId}', encodeURIComponent(String(params.widgetId)));
    const req: HttpRequest = { method: 'GET', url, headers: opts?.headers, signal: opts?.signal };
    const res = await this.request(req, opts);
    return res;
  }

}

export class RASClient {
  readonly baseURL: string;
  readonly http: HttpClient;
  readonly defaultHeaders?: Record<string,string>;

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

  constructor(baseURL?: string, http?: HttpClient, defaultHeaders?: Record<string,string>) {
    this.baseURL = baseURL || DEFAULT_BASE_URL;
    this.http = http || fetchAdapter();
    this.defaultHeaders = defaultHeaders;
    this.admin = new AdminClient(this.baseURL, this.http, this.defaultHeaders);
    this.ai = new AiClient(this.baseURL, this.http, this.defaultHeaders);
    this.alarmClasses = new AlarmClassesClient(this.baseURL, this.http, this.defaultHeaders);
    this.alarms = new AlarmsClient(this.baseURL, this.http, this.defaultHeaders);
    this.association = new AssociationClient(this.baseURL, this.http, this.defaultHeaders);
    this.audit = new AuditClient(this.baseURL, this.http, this.defaultHeaders);
    this.auth = new AuthClient(this.baseURL, this.http, this.defaultHeaders);
    this.backup = new BackupClient(this.baseURL, this.http, this.defaultHeaders);
    this.datastore = new DatastoreClient(this.baseURL, this.http, this.defaultHeaders);
    this.devices = new DevicesClient(this.baseURL, this.http, this.defaultHeaders);
    this.diagnostics = new DiagnosticsClient(this.baseURL, this.http, this.defaultHeaders);
    this.docs = new DocsClient(this.baseURL, this.http, this.defaultHeaders);
    this.edges = new EdgesClient(this.baseURL, this.http, this.defaultHeaders);
    this.emailQueue = new EmailQueueClient(this.baseURL, this.http, this.defaultHeaders);
    this.flows = new FlowsClient(this.baseURL, this.http, this.defaultHeaders);
    this.hierarchy = new HierarchyClient(this.baseURL, this.http, this.defaultHeaders);
    this.histories = new HistoriesClient(this.baseURL, this.http, this.defaultHeaders);
    this.insights = new InsightsClient(this.baseURL, this.http, this.defaultHeaders);
    this.jobs = new JobsClient(this.baseURL, this.http, this.defaultHeaders);
    this.journal = new JournalClient(this.baseURL, this.http, this.defaultHeaders);
    this.nav = new NavClient(this.baseURL, this.http, this.defaultHeaders);
    this.networkDevices = new NetworkDevicesClient(this.baseURL, this.http, this.defaultHeaders);
    this.nodes = new NodesClient(this.baseURL, this.http, this.defaultHeaders);
    this.nodesHierarchy = new NodesHierarchyClient(this.baseURL, this.http, this.defaultHeaders);
    this.nodesPages = new NodesPagesClient(this.baseURL, this.http, this.defaultHeaders);
    this.nodesPagesAttach = new NodesPagesAttachClient(this.baseURL, this.http, this.defaultHeaders);
    this.nodesRelationships = new NodesRelationshipsClient(this.baseURL, this.http, this.defaultHeaders);
    this.nodesValidateRelationships = new NodesValidateRelationshipsClient(this.baseURL, this.http, this.defaultHeaders);
    this.orgAdmin = new OrgAdminClient(this.baseURL, this.http, this.defaultHeaders);
    this.orgs = new OrgsClient(this.baseURL, this.http, this.defaultHeaders);
    this.pages = new PagesClient(this.baseURL, this.http, this.defaultHeaders);
    this.pagesStructure = new PagesStructureClient(this.baseURL, this.http, this.defaultHeaders);
    this.pagesTemplatesAttach = new PagesTemplatesAttachClient(this.baseURL, this.http, this.defaultHeaders);
    this.pagesUsage = new PagesUsageClient(this.baseURL, this.http, this.defaultHeaders);
    this.pagesValidate = new PagesValidateClient(this.baseURL, this.http, this.defaultHeaders);
    this.pagesWidgetsAttach = new PagesWidgetsAttachClient(this.baseURL, this.http, this.defaultHeaders);
    this.pallet = new PalletClient(this.baseURL, this.http, this.defaultHeaders);
    this.ping = new PingClient(this.baseURL, this.http, this.defaultHeaders);
    this.plugins = new PluginsClient(this.baseURL, this.http, this.defaultHeaders);
    this.portMappings = new PortMappingsClient(this.baseURL, this.http, this.defaultHeaders);
    this.ports = new PortsClient(this.baseURL, this.http, this.defaultHeaders);
    this.publicDevice = new PublicDeviceClient(this.baseURL, this.http, this.defaultHeaders);
    this.query = new QueryClient(this.baseURL, this.http, this.defaultHeaders);
    this.refs = new RefsClient(this.baseURL, this.http, this.defaultHeaders);
    this.runtime = new RuntimeClient(this.baseURL, this.http, this.defaultHeaders);
    this.rxai = new RxaiClient(this.baseURL, this.http, this.defaultHeaders);
    this.schemas = new SchemasClient(this.baseURL, this.http, this.defaultHeaders);
    this.tabsTemplatesAttach = new TabsTemplatesAttachClient(this.baseURL, this.http, this.defaultHeaders);
    this.tabsWidgetsAttach = new TabsWidgetsAttachClient(this.baseURL, this.http, this.defaultHeaders);
    this.tags = new TagsClient(this.baseURL, this.http, this.defaultHeaders);
    this.teams = new TeamsClient(this.baseURL, this.http, this.defaultHeaders);
    this.templates = new TemplatesClient(this.baseURL, this.http, this.defaultHeaders);
    this.templatesUsage = new TemplatesUsageClient(this.baseURL, this.http, this.defaultHeaders);
    this.templatesValidate = new TemplatesValidateClient(this.baseURL, this.http, this.defaultHeaders);
    this.templatesWidgetsAttach = new TemplatesWidgetsAttachClient(this.baseURL, this.http, this.defaultHeaders);
    this.users = new UsersClient(this.baseURL, this.http, this.defaultHeaders);
    this.validateAllRefs = new ValidateAllRefsClient(this.baseURL, this.http, this.defaultHeaders);
    this.widgets = new WidgetsClient(this.baseURL, this.http, this.defaultHeaders);
    this.widgetsUsage = new WidgetsUsageClient(this.baseURL, this.http, this.defaultHeaders);
    this.widgetsValidate = new WidgetsValidateClient(this.baseURL, this.http, this.defaultHeaders);
  }
}
