/**
 * Plugindata REST client for the taskmanager plugin.
 * All data goes through rubix's generic plugindata API — the plugin has no HTTP server.
 */

const PLUGIN_ID = 'nube.taskmanager';

function base(baseUrl: string, orgId: string, deviceId: string, table: string): string {
  return `${baseUrl}/orgs/${orgId}/devices/${deviceId}/plugindata/${PLUGIN_ID}/${table}`;
}

function authHeaders(token?: string): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h['Authorization'] = `Bearer ${token}`;
  return h;
}

// rubix always wraps responses as { data: ..., meta: { timestamp: "..." } }
interface RubixResponse { data: unknown; meta?: unknown; }

async function checkOk(res: Response): Promise<unknown> {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  const body = await res.json() as RubixResponse;
  // Unwrap the data field; fall back to the raw body for unexpected shapes
  return 'data' in body ? body.data : body;
}

// --- Projects ---

export async function listProjects(
  baseUrl: string, orgId: string, deviceId: string, token?: string
): Promise<any[]> {
  const res = await fetch(base(baseUrl, orgId, deviceId, 'projects'), {
    headers: authHeaders(token),
  });
  return (await checkOk(res)) as any[];
}

export async function createProject(
  baseUrl: string, orgId: string, deviceId: string, token: string | undefined,
  data: { name: string; description: string }
): Promise<any> {
  const res = await fetch(base(baseUrl, orgId, deviceId, 'projects'), {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return checkOk(res);
}

export async function updateProject(
  baseUrl: string, orgId: string, deviceId: string, token: string | undefined,
  id: number, data: Partial<{ name: string; description: string; status: string }>
): Promise<any> {
  const res = await fetch(`${base(baseUrl, orgId, deviceId, 'projects')}/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return checkOk(res);
}

export async function deleteProject(
  baseUrl: string, orgId: string, deviceId: string, token: string | undefined, id: number
): Promise<void> {
  const res = await fetch(`${base(baseUrl, orgId, deviceId, 'projects')}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  await checkOk(res);
}

// --- Tasks ---

export async function listTasks(
  baseUrl: string, orgId: string, deviceId: string, token: string | undefined,
  projectId: number
): Promise<any[]> {
  const url = `${base(baseUrl, orgId, deviceId, 'tasks')}?filter[project_id]=${projectId}`;
  const res = await fetch(url, { headers: authHeaders(token) });
  return (await checkOk(res)) as any[];
}

export async function createTask(
  baseUrl: string, orgId: string, deviceId: string, token: string | undefined,
  data: {
    project_id: number; title: string; description: string;
    status: string; priority: string;
    assigned_user_id?: string; assigned_user_name?: string; due_date?: string;
  }
): Promise<any> {
  const res = await fetch(base(baseUrl, orgId, deviceId, 'tasks'), {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return checkOk(res);
}

export async function updateTask(
  baseUrl: string, orgId: string, deviceId: string, token: string | undefined,
  id: number, data: Partial<{
    title: string; description: string; status: string;
    priority: string; assigned_user_id: string; assigned_user_name: string; due_date: string;
  }>
): Promise<any> {
  const res = await fetch(`${base(baseUrl, orgId, deviceId, 'tasks')}/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return checkOk(res);
}

export async function deleteTask(
  baseUrl: string, orgId: string, deviceId: string, token: string | undefined, id: number
): Promise<void> {
  const res = await fetch(`${base(baseUrl, orgId, deviceId, 'tasks')}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
  await checkOk(res);
}

// --- Aggregate stats ---

export interface AggregateColumn { fn: string; col: string; alias: string; }

export async function aggregate(
  baseUrl: string, orgId: string, deviceId: string, token: string | undefined,
  table: string, columns: AggregateColumn[], groupBy?: string[], filter?: Record<string, string>
): Promise<any[]> {
  const res = await fetch(`${base(baseUrl, orgId, deviceId, table)}/aggregate`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ columns, groupBy, filter }),
  });
  return (await checkOk(res)) as any[];
}
