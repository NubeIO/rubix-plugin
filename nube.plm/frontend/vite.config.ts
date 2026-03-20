import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'nube_plm',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductTableWidget': './src/products/widget/ProductTableWidget.tsx',
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
  resolve: {
    alias: {
      // @rubix/sdk → rubix-plugin/frontend-sdk (generated RAS client)
      '@rubix/sdk': path.resolve(__dirname, '../../frontend-sdk'),
    },
  },
  base: '/api/v1/ext/nube.plm/',
  build: {
    target: 'esnext',
    outDir: '../dist-frontend',
    emptyOutDir: true,
  },
});
