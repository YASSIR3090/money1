// vite.config.js - MOBILE OPTIMIZED
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Allows access from mobile on same network
    open: false, // Don't auto-open browser
    cors: true, // Enable CORS for mobile
    headers: {
      // ✅ MOBILE FIX: Important headers for mobile
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  build: {
    // ✅ MOBILE FIX: Optimize for mobile
    target: 'es2020',
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        }
      }
    }
  },
  define: {
    'process.env': process.env
  }
})