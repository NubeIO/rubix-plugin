/**
 * Task Manager Widget — exposed via Module Federation as './Widget'
 *
 * Compact stats card showing live project and task counts.
 * Polls the rubix plugindata aggregate API with configurable settings.
 */

import { useEffect, useState } from 'react';
import { aggregate } from './api';

interface WidgetProps {
  orgId: string;
  deviceId: string;
  nodeId?: string;
  token?: string;
  baseUrl?: string;
  settings?: TaskStatsSettings;
}

interface TaskStatsSettings {
  display?: {
    showProjects?: boolean;
    showTotalTasks?: boolean;
    showActiveBreakdown?: boolean;
    compactMode?: boolean;
  };
  refresh?: {
    interval?: number;
    enableAutoRefresh?: boolean;
  };
  appearance?: {
    theme?: 'default' | 'accent' | 'success' | 'warning';
    fontSize?: 'small' | 'medium' | 'large';
    showIcon?: boolean;
  };
  advanced?: {
    enableDebugMode?: boolean;
    showLastRefresh?: boolean;
  };
}

interface Stats {
  projects: number;
  total: number;
  active: number;
  done: number;
  lastRefresh?: string;
}

export default function Widget({
  orgId,
  deviceId,
  nodeId,
  token,
  baseUrl = '/api/v1',
  settings: propSettings
}: WidgetProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Apply settings with defaults from YAML schema
  const settings = propSettings || {};
  const pollInterval = (settings.refresh?.interval ?? 30) * 1000;
  const autoRefresh = settings.refresh?.enableAutoRefresh ?? true;
  const showProjects = settings.display?.showProjects ?? true;
  const showTotalTasks = settings.display?.showTotalTasks ?? true;
  const showActiveBreakdown = settings.display?.showActiveBreakdown ?? true;
  const compactMode = settings.display?.compactMode ?? false;
  const theme = settings.appearance?.theme ?? 'default';
  const fontSize = settings.appearance?.fontSize ?? 'medium';
  const showIcon = settings.appearance?.showIcon ?? true;
  const enableDebugMode = settings.advanced?.enableDebugMode ?? false;
  const showLastRefresh = settings.advanced?.showLastRefresh ?? false;

  async function load() {
    if (enableDebugMode) {
      console.log('[TaskManager Widget] Fetching stats...', { orgId, deviceId, settings });
    }

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

      const newStats = {
        projects,
        total,
        active,
        done,
        lastRefresh: new Date().toLocaleTimeString()
      };

      setStats(newStats);
      setError(null);

      if (enableDebugMode) {
        console.log('[TaskManager Widget] Stats updated:', newStats);
      }
    } catch (e) {
      const errMsg = e instanceof Error ? e.message : String(e);
      setError(errMsg);

      if (enableDebugMode) {
        console.error('[TaskManager Widget] Error:', e);
      }
    }
  }

  useEffect(() => {
    if (!autoRefresh) {
      load(); // Load once but don't set up interval
      return;
    }

    load();
    const id = setInterval(load, pollInterval);
    return () => clearInterval(id);
  }, [orgId, deviceId, token, baseUrl, pollInterval, autoRefresh]);

  // Apply appearance settings
  const baseFontSize = fontSize === 'small' ? 10 : fontSize === 'large' ? 14 : 12;
  const padding = compactMode ? '0.5rem' : '0.75rem';
  const bigFontSize = compactMode ? 22 : 26;

  // Theme colors
  const themeColors = {
    default: { accent: '#666', success: '#2a2' },
    accent: { accent: '#3b82f6', success: '#10b981' },
    success: { accent: '#10b981', success: '#059669' },
    warning: { accent: '#f59e0b', success: '#10b981' }
  };
  const colors = themeColors[theme] || themeColors.default;

  const card: React.CSSProperties = {
    fontFamily: 'sans-serif',
    padding,
    fontSize: baseFontSize,
  };
  const row: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: compactMode ? 4 : 6,
  };
  const big: React.CSSProperties = {
    fontSize: bigFontSize,
    fontWeight: 700,
    lineHeight: 1,
    color: colors.accent
  };
  const label: React.CSSProperties = {
    color: '#888',
    fontSize: baseFontSize - 1
  };

  if (error) {
    return (
      <div style={{ ...card, color: '#c00' }}>
        {showIcon && '📋 '}Task Manager<br />
        <span style={{ fontSize: baseFontSize - 1 }}>{error}</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ ...card, color: '#aaa' }}>
        {showIcon && '📋 '}Loading…
      </div>
    );
  }

  return (
    <div style={card}>
      <div style={{ ...label, marginBottom: compactMode ? 4 : 8 }}>
        {showIcon && '📋 '}Task Manager
      </div>

      {showProjects && (
        <div style={row}>
          <span style={label}>Projects</span>
          <span style={big}>{stats.projects}</span>
        </div>
      )}

      {showTotalTasks && (
        <div style={row}>
          <span style={label}>Tasks</span>
          <span style={big}>{stats.total}</span>
        </div>
      )}

      {showActiveBreakdown && (
        <div style={{ display: 'flex', gap: 12, marginTop: compactMode ? 2 : 4 }}>
          <div>
            <div style={label}>Active</div>
            <div style={{ fontWeight: 600, fontSize: baseFontSize + 2 }}>{stats.active}</div>
          </div>
          <div>
            <div style={label}>Done</div>
            <div style={{ fontWeight: 600, fontSize: baseFontSize + 2, color: colors.success }}>
              {stats.done}
            </div>
          </div>
        </div>
      )}

      {showLastRefresh && stats.lastRefresh && (
        <div style={{ ...label, marginTop: compactMode ? 2 : 4, fontSize: baseFontSize - 2 }}>
          Last refresh: {stats.lastRefresh}
        </div>
      )}
    </div>
  );
}
