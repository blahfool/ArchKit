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
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});