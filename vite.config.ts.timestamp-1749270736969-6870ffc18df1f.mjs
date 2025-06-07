// vite.config.ts
import { defineConfig } from "file:///app/node_modules/vite/dist/node/index.js";
import react from "file:///app/node_modules/@vitejs/plugin-react/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 3e3,
    host: true,
    // This will make the server accessible from all network interfaces
    strictPort: true,
    // This will fail if port 3000 is not available
    open: false,
    // Disable auto-opening browser in container environment
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "b8c8d777-55f8-4377-82ad-df17cb320230.preview.emergentagent.com",
      ".preview.emergentagent.com"
      // Allow all preview subdomains
    ]
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvYXBwXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvYXBwL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9hcHAvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHNlcnZlcjoge1xuICAgIHBvcnQ6IDMwMDAsXG4gICAgaG9zdDogdHJ1ZSwgLy8gVGhpcyB3aWxsIG1ha2UgdGhlIHNlcnZlciBhY2Nlc3NpYmxlIGZyb20gYWxsIG5ldHdvcmsgaW50ZXJmYWNlc1xuICAgIHN0cmljdFBvcnQ6IHRydWUsIC8vIFRoaXMgd2lsbCBmYWlsIGlmIHBvcnQgMzAwMCBpcyBub3QgYXZhaWxhYmxlXG4gICAgb3BlbjogZmFsc2UsIC8vIERpc2FibGUgYXV0by1vcGVuaW5nIGJyb3dzZXIgaW4gY29udGFpbmVyIGVudmlyb25tZW50XG4gICAgYWxsb3dlZEhvc3RzOiBbXG4gICAgICAnbG9jYWxob3N0JyxcbiAgICAgICcxMjcuMC4wLjEnLFxuICAgICAgJ2I4YzhkNzc3LTU1ZjgtNDM3Ny04MmFkLWRmMTdjYjMyMDIzMC5wcmV2aWV3LmVtZXJnZW50YWdlbnQuY29tJyxcbiAgICAgICcucHJldmlldy5lbWVyZ2VudGFnZW50LmNvbScgLy8gQWxsb3cgYWxsIHByZXZpZXcgc3ViZG9tYWluc1xuICAgIF1cbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgZXhjbHVkZTogWydsdWNpZGUtcmVhY3QnXSxcbiAgfSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE4TCxTQUFTLG9CQUFvQjtBQUMzTixPQUFPLFdBQVc7QUFHbEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sWUFBWTtBQUFBO0FBQUEsSUFDWixNQUFNO0FBQUE7QUFBQSxJQUNOLGNBQWM7QUFBQSxNQUNaO0FBQUEsTUFDQTtBQUFBLE1BQ0E7QUFBQSxNQUNBO0FBQUE7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
