/**
 * Example Plugin Page — exposed via Module Federation as './Page'
 *
 * Rubix host loads this component and passes:
 *   orgId    — current org ID
 *   deviceId — current device ID
 *   token    — JWT bearer token (same one the host uses)
 *   baseUrl  — rubix API base URL (default '/api/v1')
 */

import { useEffect, useState } from 'react';
import { RASClient, fetchAdapter } from '@rubix/sdk/ras/client';
import type { Node } from '@rubix/sdk/ras/types';

interface PageProps {
  orgId: string;
  deviceId: string;
  token?: string;
  baseUrl?: string;
}

/** Build a rasClient using the token passed from the host. */
function makeClient(baseUrl: string, token?: string) {
  const base = fetchAdapter();
  return new RASClient(baseUrl, async (req) => {
    if (token) {
      req.headers = { ...req.headers, Authorization: `Bearer ${token}` };
    }
    return base(req);
  });
}

export default function Page({ orgId, deviceId, token, baseUrl = '/api/v1' }: PageProps) {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const client = makeClient(baseUrl, token);
    client.nodes
      .list({ orgId, deviceId })
      .then((res: any) => {
        // API returns { data: Node[], meta: { total: n } }
        const nodeList: Node[] = Array.isArray(res?.data) ? res.data : [];
        const nodeCount: number = res?.meta?.total ?? nodeList.length;
        setNodes(nodeList);
        setCount(nodeCount);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, [orgId, deviceId, token, baseUrl]);

  const lastNode = nodes.length > 0 ? nodes[nodes.length - 1] : null;
  // name is a top-level field (n.name), data.name is node-specific config
  const lastNodeName = (lastNode as any)?.name ?? lastNode?.type ?? lastNode?.id ?? '—';

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: 600 }}>
      <h2 style={{ marginBottom: '0.5rem' }}>Example Plugin Page</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: 13 }}>
        org: <code>{orgId}</code> · device: <code>{deviceId}</code>
      </p>

      {loading && <p style={{ color: '#888' }}>Loading nodes…</p>}

      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>
      )}

      {!loading && !error && (
        <>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
            <Stat label='Node count' value={String(count)} />
            <Stat label='Last node' value={lastNodeName} />
          </div>

          {nodes.length === 0 ? (
            <p style={{ color: '#888' }}>No nodes found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>
                  <th style={{ padding: '6px 8px' }}>#</th>
                  <th style={{ padding: '6px 8px' }}>Name</th>
                  <th style={{ padding: '6px 8px' }}>Type</th>
                  <th style={{ padding: '6px 8px' }}>ID</th>
                </tr>
              </thead>
              <tbody>
                {nodes.map((n, i) => {
                  const name = (n as any)?.name ?? '—';
                  const isLast = i === nodes.length - 1;
                  return (
                    <tr
                      key={n.id ?? i}
                      style={{
                        background: isLast ? '#fffbe6' : i % 2 === 0 ? '#fafafa' : '#fff',
                        borderBottom: '1px solid #eee',
                      }}
                    >
                      <td style={{ padding: '6px 8px', color: '#999' }}>{i + 1}</td>
                      <td style={{ padding: '6px 8px', fontWeight: isLast ? 600 : 400 }}>
                        {name}
                        {isLast && (
                          <span style={{ marginLeft: 6, fontSize: 11, color: '#b8860b' }}>← last</span>
                        )}
                      </td>
                      <td style={{ padding: '6px 8px', color: '#555' }}>{n.type ?? '—'}</td>
                      <td style={{ padding: '6px 8px', color: '#999', fontFamily: 'monospace', fontSize: 11 }}>
                        {n.id ?? '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '1rem 1.5rem',
        minWidth: 140,
        background: '#fff',
      }}
    >
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
