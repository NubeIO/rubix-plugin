import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'nube_plm',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductTableWidget': './src/widgets/ProductTableWidget.tsx',
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: '19.0.0',
        },
        'react-dom': {
          singleton: true,
          requiredVersion: '19.0.0',
        },
      },
    }),
  ],
  base: '/api/v1/ext/nube.plm/',
  build: {
    target: 'esnext',
    outDir: '../dist-frontend',
    emptyOutDir: true,
  },
});
