import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
    },
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
