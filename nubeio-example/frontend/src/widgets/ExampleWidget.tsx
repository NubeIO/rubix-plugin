import { useState, useEffect } from 'react';

interface ExampleWidgetProps {
  orgId?: string;
  deviceId?: string;
  config?: Record<string, unknown>;
}

export default function ExampleWidget({ orgId, deviceId, config }: ExampleWidgetProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Example Plugin Widget 222</div>
      <div style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 4 }}>{count}</div>
      <div style={{ fontSize: 12, color: '#666' }}>seconds running</div>
      {orgId && (
        <div style={{ marginTop: 12, fontSize: 11, color: '#999' }}>
          org: {orgId} · device: {deviceId}
        </div>
      )}
      {config && Object.keys(config).length > 0 && (
        <pre style={{ marginTop: 8, fontSize: 10, color: '#aaa' }}>
          {JSON.stringify(config, null, 2)}
        </pre>
      )}
    </div>
  );
}
