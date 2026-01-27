import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/', // Ensure base path is set correctly
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
    allowedHosts: ['naida-unbestowed-annice.ngrok-free.dev'],
  },
  publicDir: 'public', // Explicitly define public directory
})
