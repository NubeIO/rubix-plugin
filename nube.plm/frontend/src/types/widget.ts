/**
 * Widget configuration types
 */

export interface WidgetSettings {
  display?: {
    showCode?: boolean;
    showStatus?: boolean;
    showPrice?: boolean;
    compactMode?: boolean;
  };
  refresh?: {
    interval?: number;
    enableAutoRefresh?: boolean;
  };
}

export interface BaseWidgetProps {
  orgId?: string;
  deviceId?: string;
  baseUrl?: string;
  token?: string;
  settings?: WidgetSettings;
  config?: Record<string, unknown>;
  nodeId?: string;
}

export interface DisplaySettings {
  showCode: boolean;
  showStatus: boolean;
  showPrice: boolean;
  compactMode: boolean;
}

export interface RefreshSettings {
  interval: number;
  autoRefresh: boolean;
}

export function parseDisplaySettings(settings?: WidgetSettings): DisplaySettings {
  return {
    showCode: settings?.display?.showCode ?? true,
    showStatus: settings?.display?.showStatus ?? true,
    showPrice: settings?.display?.showPrice ?? true,
    compactMode: settings?.display?.compactMode ?? false,
  };
}

export function parseRefreshSettings(settings?: WidgetSettings): RefreshSettings {
  return {
    interval: (settings?.refresh?.interval ?? 30) * 1000,
    autoRefresh: settings?.refresh?.enableAutoRefresh ?? true,
  };
}
