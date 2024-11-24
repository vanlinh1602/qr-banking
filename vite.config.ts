import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  nodePolyfills({
    include: ['path'],
    exclude: [
      'http',
    ],
    globals: {
      Buffer: true,
      global: true,
      process: true,
    },
    overrides: {
      fs: 'memfs',
    },
    protocolImports: true,
  })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
