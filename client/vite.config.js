import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';
import svgr from 'vite-plugin-svgr';


export default defineConfig({
  base: '/DiscountMart/', 
  plugins: [
    reactRefresh(),
     svgr({
      svgrOptions: {
        exportType: 'named',
        refresh: true,
        svgo: false,
        titleProp: true,
      },
      include: '**/*.svg',
     }),
  ],
  root: path.resolve(__dirname, "."),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "client/src"),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    port: 5173,
    host:'0.0.0.0',
    strictPort: true,
    open: false,
    middlewareMode: true,
    hmr:{
      protocol: 'ws',
      host: 'localhost',
    }

  },
  preview: {
    port: 4173,
    open: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kB,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', '@tanstack/react-query'],
        },
      },
    },
  },
});
