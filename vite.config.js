import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '/symbols': path.resolve(__dirname, './public/symbols')
    }
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
    allowedHosts: ['naida-unbestowed-annice.ngrok-free.dev'],
  },
  publicDir: 'public',
})
