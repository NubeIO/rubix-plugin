interface ExamplePageProps {
  orgId?: string;
  deviceId?: string;
  [key: string]: unknown;
}

export default function ExamplePage({ orgId, deviceId }: ExamplePageProps) {
  return (
    <div style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Example Plugin</h1>
      <p style={{ color: '#666', marginBottom: 24 }}>
        This page is contributed by the <strong>nube.example</strong> plugin
        and rendered natively via Module Federation.
      </p>
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, flex: 1 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Organisation</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{orgId ?? '—'}</div>
        </div>
        <div style={{ padding: 16, background: '#f5f5f5', borderRadius: 8, flex: 1 }}>
          <div style={{ fontSize: 12, color: '#888' }}>Device</div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{deviceId ?? '—'}</div>
        </div>
      </div>
    </div>
  );
}
