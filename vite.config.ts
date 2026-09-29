import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    host: true, // Listen on all network addresses (0.0.0.0)
    port: 5173,
  },
  preview: {
    host: true,
    port: 5173,
  },
})
