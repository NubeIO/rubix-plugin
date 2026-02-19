/**
 * Task Manager Widget — exposed via Module Federation as './Widget'
 *
 * Compact stats card showing live project and task counts.
 * Polls the rubix plugindata aggregate API every 30s.
 */

import { useEffect, useState } from 'react';
import { aggregate } from './api';

interface WidgetProps {
  orgId: string;
  deviceId: string;
  token?: string;
  baseUrl?: string;
}

interface Stats {
  projects: number;
  total: number;
  active: number;
  done: number;
}

const POLL_MS = 30_000;

export default function Widget({ orgId, deviceId, token, baseUrl = '/api/v1' }: WidgetProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      const [projRows, taskRows] = await Promise.all([
        aggregate(baseUrl, orgId, deviceId, token, 'projects',
          [{ fn: 'count', col: '*', alias: 'cnt' }]),
        aggregate(baseUrl, orgId, deviceId, token, 'tasks',
          [{ fn: 'count', col: '*', alias: 'cnt' }],
          ['status']),
      ]);

      const projects = Number(projRows[0]?.cnt ?? 0);
      let total = 0, active = 0, done = 0;
      for (const row of taskRows) {
        const cnt = Number(row.cnt ?? 0);
        total += cnt;
        if (row.status === 'done') done += cnt;
        else active += cnt;
      }
      setStats({ projects, total, active, done });
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_MS);
    return () => clearInterval(id);
  }, [orgId, deviceId, token, baseUrl]);

  const card: React.CSSProperties = {
    fontFamily: 'sans-serif',
    padding: '0.75rem',
    fontSize: 12,
  };
  const row: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  };
  const big: React.CSSProperties = { fontSize: 26, fontWeight: 700, lineHeight: 1 };
  const label: React.CSSProperties = { color: '#888', fontSize: 11 };

  if (error) {
    return (
      <div style={{ ...card, color: '#c00' }}>
        Task Manager<br /><span style={{ fontSize: 11 }}>{error}</span>
      </div>
    );
  }

  if (!stats) {
    return <div style={{ ...card, color: '#aaa' }}>Loading…</div>;
  }

  return (
    <div style={card}>
      <div style={{ ...label, marginBottom: 8 }}>Task Manager</div>
      <div style={row}>
        <span style={label}>Projects</span>
        <span style={big}>{stats.projects}</span>
      </div>
      <div style={row}>
        <span style={label}>Tasks</span>
        <span style={big}>{stats.total}</span>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
        <div>
          <div style={label}>Active</div>
          <div style={{ fontWeight: 600 }}>{stats.active}</div>
        </div>
        <div>
          <div style={label}>Done</div>
          <div style={{ fontWeight: 600, color: '#2a2' }}>{stats.done}</div>
        </div>
      </div>
    </div>
  );
}
