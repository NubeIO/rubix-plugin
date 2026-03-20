import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      // Must match the name the host registers: mfName('nube.taskmanager') = 'nube_taskmanager'
      name: 'nube_taskmanager',
      filename: 'remoteEntry.js',
      exposes: {
        './Page':              './src/Page.tsx',
        './Widget':            './src/Widget.tsx',
        './ProjectListWidget': './src/ProjectListWidget.tsx',
        './TaskListWidget':    './src/TaskListWidget.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
  base: '/api/v1/ext/nube.taskmanager/',
  build: {
    // Output to dist-frontend/ at the plugin root (next to plugin.json).
    outDir: '../dist-frontend',
    emptyOutDir: true,
    target: 'esnext',
    minify: false,
  },
});
