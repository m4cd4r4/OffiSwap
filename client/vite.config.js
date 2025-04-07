import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], // Remove custom plugin
  server: {
    proxy: {}, // Use empty proxy object for testing
    // Optional: Specify port if needed, otherwise Vite finds one
    // port: 5173,
  },
})
