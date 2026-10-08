import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // GitHub Pages serves the app from /<repo>/; the deploy workflow sets this.
  base: process.env.BASE_PATH ?? '/',
  define: {
    // Shown in Settings so you can tell whether the phone picked up a new deploy.
    __BUILD__: JSON.stringify(new Date().toISOString().slice(0, 16).replace('T', ' ') + ' UTC'),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      pwaAssets: { config: true, overrideManifestIcons: true },
      workbox: { globPatterns: ['**/*.{js,css,html,png,ico,svg}'] },
      manifest: {
        name: 'CTRL',
        short_name: 'CTRL',
        description: 'Set your state.',
        theme_color: '#0b0c0e',
        background_color: '#0b0c0e',
        display: 'standalone',
        orientation: 'portrait',
      },
    }),
  ],
})
