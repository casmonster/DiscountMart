// vite.config.ts in root or client/
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@server': path.resolve(__dirname, 'server'),
    },
  },
});
