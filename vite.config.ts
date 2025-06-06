import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true, // This will make the server accessible from all network interfaces
    strictPort: true, // This will fail if port 3000 is not available
    open: false, // Disable auto-opening browser in container environment
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'b8c8d777-55f8-4377-82ad-df17cb320230.preview.emergentagent.com',
      '.preview.emergentagent.com' // Allow all preview subdomains
    ]
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
