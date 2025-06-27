import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig(({ mode }) => {
  // Load .env.[mode] files
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: mode === 'production' ? '/DiscountMart/' : '/',
    plugins: [
      react(),
      svgr({
        svgrOptions: {
          exportType: 'named',
          svgo: false,
          titleProp: true,
        },
        include: '**/*.svg',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@assets': path.resolve(__dirname, 'src/assets'),
        '@components': path.resolve(__dirname, 'src/components'),
        '@shared': path.resolve(__dirname, '../shared'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT) || 5174,
      strictPort: true,
      open: false,
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
    preview: {
      port: 4173,
      open: true,
      allowedHosts: ['discountmart.onrender.com'],
    },
    build: {
      sourcemap: true,
      outDir: 'dist',
      emptyOutDir: true,
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', '@tanstack/react-query'],
          },
        },
      },
    },
  }
})
