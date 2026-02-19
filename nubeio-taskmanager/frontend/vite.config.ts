import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      // Must match the name the host registers: mfName('nube.taskmanager') = 'nube_taskmanager'
      name: 'nube_taskmanager',
      filename: 'remoteEntry.js',
      exposes: {
        './Page':   './src/Page.tsx',
        './Widget': './src/Widget.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  build: {
    // Output to dist-frontend/ at the plugin root (next to plugin.json).
    outDir: '../dist-frontend',
    emptyOutDir: true,
    target: 'esnext',
    minify: false,
  },
});
