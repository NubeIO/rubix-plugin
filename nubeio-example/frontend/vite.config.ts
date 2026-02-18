import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      // Must match the name the host registers: mfName('nube.example') = 'nube_example'
      name: 'nube_example',
      // remoteEntry.js is served at /api/v1/ext/{pluginId}/remoteEntry.js
      // The backend's static handler maps that URL to dist-frontend/remoteEntry.js
      filename: 'remoteEntry.js',
      exposes: {
        // './Page' matches plugin.json pages[].props.exposedPath
        './Page':   './src/Page.tsx',
        './Widget': './src/Widget.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  resolve: {
    alias: {
      // @rubix/sdk → rubix-plugin/frontend-sdk (generated+synced by `make build-ts`)
      // Plugin devs outside this repo: copy frontend-sdk/ into their project and
      // update this alias, or install @nube/rubix-sdk once published to npm.
      '@rubix/sdk': path.resolve(__dirname, '../../frontend-sdk'),
    },
  },
  build: {
    // Output to dist-frontend/ at the plugin root (next to plugin.json).
    // build-plugin.sh copies this to the install dir.
    outDir: '../dist-frontend',
    emptyOutDir: true,
    target: 'esnext',
    minify: false,
  },
});
