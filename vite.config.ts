import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { visualizer } from 'rollup-plugin-visualizer';


export default defineConfig({
  base: "/DiscountMart/",
  plugins: [react(), visualizer({ open: true })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
        warn(warning);
      },
        output: {
        manualChunks: {
          // Split React and ReactDOM into a separate chunk
          react: ['react', 'react-dom'],
          // Split common vendor libs
          vendor: ['react-router-dom', 'zod', 'react-hook-form'],
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
// removed import.meta.env.MODE === "development" and import.meta.env.PROD due to vite.config.ts being used in production