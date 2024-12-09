import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@backend': path.resolve(__dirname, '../backend'),
    },
  },
  build: {
    rollupOptions: {
      external: [path.resolve(__dirname, '../backend/blockchain/nodeInterface.js')],
    },
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
});