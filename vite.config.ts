import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,wav}'],
        maximumFileSizeToCacheInBytes: 10 * 1024 * 1024, // 10MB limit for audio files
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      },
      manifest: {
        name: 'Spinkru',
        short_name: 'Spinkru',
        description: 'Create spooky and groovy beats with Spinkru\'s interactive musical characters!',
        theme_color: '#87ceeb',
        background_color: '#000000',
        display: 'fullscreen',
        start_url: '.',
        icons: [
          {
            src: '/music-favicon.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/music-favicon.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
