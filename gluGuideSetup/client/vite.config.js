import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env variables based on mode (.env.production, .env.local, etc.)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    test: {
      globals: true,
      environment: 'jsdom',
      include: ['**/*.test.js', '**/*.test.jsx'],
      exclude: ['node_modules'],
    },
    server: {
      hmr: {
        overlay: false
      }
    }
  }
})
