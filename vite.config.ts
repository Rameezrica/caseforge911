import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // This will make the server accessible from all network interfaces
    strictPort: true, // This will fail if port 3000 is not available
    open: false // Disable auto-opening browser in container environment
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
