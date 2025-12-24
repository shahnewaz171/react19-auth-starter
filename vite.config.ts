import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler']
      }
    }),
    tailwindcss(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      sourcemap: true,
      emitFile: true,
      title: 'Bundle Analysis',
      filename: 'dist/bundle-report.html'
    })
  ],
  resolve: {
    alias: {
      '@': '/src',
      'react-dom/client': 'react-dom/profiling'
    }
  },
  build: {
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router'],
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
          'mui-icons': ['@mui/icons-material'],
          'form-libs': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'auth-libs': ['@clerk/clerk-react']
        }
      }
    }
  }
});
