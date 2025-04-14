import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: './postcss.config.js',
  },
  assetsInclude: ['**/*.jpg', '**/*.jpeg', '**/*.png', '**/*.svg'],
  server: {
    host: '0.0.0.0', // Allow access from LAN
    port: 4000,      // Vue frontend port
    proxy: {
      '/api': {      // Redirect requests starting with "/api"
        target: 'http://192.168.1.4:3000', // Node.js backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Remove "/api" prefix
      }
    }
  }
}) 