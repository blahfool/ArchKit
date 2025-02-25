import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { cartographer } from '@replit/vite-plugin-cartographer';

export default defineConfig({
  plugins: [
    react(),
    cartographer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  base: './', // Make all asset paths relative
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'wouter'],
        }
      }
    }
  }
});