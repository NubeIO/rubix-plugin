import React from 'react';
import ReactDOM from 'react-dom/client';
import Page from './Page';

// Dev harness: render the Page directly with stub props
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Page
      orgId="org1"
      deviceId="device0"
      baseUrl="/api/v1"
    />
  </React.StrictMode>
);
