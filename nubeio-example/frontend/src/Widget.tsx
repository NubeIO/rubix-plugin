/**
 * Example Plugin Widget — exposed via Module Federation as './Widget'
 *
 * Rendered inside a dashboard tile. Receives the same props as Page.
 * Keep it compact — it lives in a small card.
 */

import { useEffect, useState } from 'react';
import { RASClient, fetchAdapter } from '@rubix/sdk/ras/client';

interface WidgetProps {
  orgId: string;
  deviceId: string;
  token?: string;
  baseUrl?: string;
}

function makeClient(baseUrl: string, token?: string) {
  const base = fetchAdapter();
  return new RASClient(baseUrl, async (req) => {
    if (token) req.headers = { ...req.headers, Authorization: `Bearer ${token}` };
    return base(req);
  });
}

export default function Widget({ orgId, deviceId, token, baseUrl = '/api/v1' }: WidgetProps) {
  const [count, setCount] = useState<number | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string>('idle');
  const [rawResponse, setRawResponse] = useState<unknown>(null);

  useEffect(() => {
    const url = `${baseUrl}/orgs/${orgId}/devices/${deviceId}/nodes`;
    setDebug(`fetching → ${url}`);

    const client = makeClient(baseUrl, token);
    client.nodes
      .list({ orgId, deviceId })
      .then((res: any) => {
        setRawResponse(res);
        // API returns { data: Node[], meta: { total: n } }
        const nodes: any[] = Array.isArray(res?.data) ? res.data : [];
        const cnt: number = res?.meta?.total ?? nodes.length;
        setCount(cnt);
        setDebug(`ok — count=${cnt} nodes=${nodes.length} keys=${Object.keys(res ?? {}).join(',')}`);
        const last = nodes[nodes.length - 1];
        // name is a top-level field on each node
        setLastName(last?.name ?? last?.type ?? last?.id ?? null);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
        setDebug(`error: ${msg}`);
      });
  }, [orgId, deviceId, token, baseUrl]);

  const s: React.CSSProperties = { fontFamily: 'monospace', fontSize: 11, padding: '0.5rem', wordBreak: 'break-all' };

  return (
    <div style={{ fontFamily: 'sans-serif', fontSize: 12 }}>
      {/* --- debug panel --- */}
      <div style={{ background: '#111', color: '#0f0', ...s }}>
        <div>orgId: {orgId} | deviceId: {deviceId}</div>
        <div>token: {token ? token.slice(0, 20) + '…' : '❌ MISSING'}</div>
        <div>baseUrl: {baseUrl}</div>
        <div>status: {debug}</div>
        {error && <div style={{ color: 'red' }}>error: {error}</div>}
        {rawResponse !== null && (
          <div style={{ marginTop: 4, color: '#ff0' }}>
            raw: {JSON.stringify(rawResponse).slice(0, 300)}
          </div>
        )}
      </div>

      {/* --- normal widget --- */}
      <div style={{ padding: '0.75rem' }}>
        <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>Nodes</div>
        <div style={{ fontSize: 28, fontWeight: 700, lineHeight: 1 }}>
          {count === null ? '…' : count}
        </div>
        {lastName && (
          <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>
            Last: <strong>{lastName}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
