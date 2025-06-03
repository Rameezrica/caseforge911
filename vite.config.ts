import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // This will make the server accessible from all network interfaces
    strictPort: true, // This will fail if port 5173 is not available
    open: true // This will automatically open the browser
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
