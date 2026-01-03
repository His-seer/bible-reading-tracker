import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Bible Reading Tracker',
        short_name: 'Bible Tracker',
        description: 'Track your 90-Day Bible Reading Challenge progress together.',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split Firebase into its own chunk
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          // Split React and related libraries
          vendor: ['react', 'react-dom'],
          // Split icons
          icons: ['lucide-react'],
        },
      },
    },
  },
})

