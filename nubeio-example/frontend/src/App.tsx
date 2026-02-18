import ExampleWidget from './widgets/ExampleWidget';
import ExamplePage from './pages/ExamplePage';

export default function App() {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 24 }}>
      <h2>Example Plugin — Dev Mode</h2>
      <p style={{ color: '#666', marginBottom: 24 }}>
        This standalone app is for isolated development only.
        In production, components are loaded via Module Federation.
      </p>
      <section style={{ marginBottom: 32 }}>
        <h3>Widget preview</h3>
        <div style={{ border: '1px solid #ccc', borderRadius: 8, maxWidth: 400 }}>
          <ExampleWidget orgId="dev-org" deviceId="dev-device" />
        </div>
      </section>
      <section>
        <h3>Page preview</h3>
        <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 16 }}>
          <ExamplePage orgId="dev-org" deviceId="dev-device" />
        </div>
      </section>
    </div>
  );
}
