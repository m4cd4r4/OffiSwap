import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Remove custom plugin
  server: {
    proxy: {
      // Proxy API requests to the backend server during development
      '/api': { // Remove trailing slash
        target: 'http://localhost:5001', // Your backend server address
        changeOrigin: true, // Restore this option
        // secure: false,      // Keep removed for now
        // Optional: rewrite path if needed, e.g., remove /api prefix
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    // Optional: Specify port if needed, otherwise Vite finds one
    // port: 5173,
  },
})
