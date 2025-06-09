import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    strictPort: false,
    open: false,
    allowedHosts: [
      'localhost',
      '8b14f97d-ea08-4824-b8b2-22a83f1c708a.preview.emergentagent.com',
      '.preview.emergentagent.com'
    ],
    hmr: {
      port: 3000,
      host: '0.0.0.0'
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['lucide-react', 'clsx', 'tailwind-merge']
        }
      }
    }
  }
});