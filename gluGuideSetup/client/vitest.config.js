import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig(({ mode }) => {
  // Load environment variables from the correct .env file
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
        'react': resolve(__dirname, './node_modules/react')
      }
    },
    define: {
      'process.env': env // This line is optional for non-Node-style code but safe to include
    },
    test: {
      environment: 'jsdom',
      include: ['**/*.test.js', '**/*.test.jsx'],
      exclude: ['node_modules'],
      globals: true,
      setupFiles: ['./setupTests.js', './tests/setup.js'],
      css: {
        modules: {
          classNameStrategy: 'non-scoped'
        }
      },
      mockCss: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov', 'html'],
        reportsDirectory: './coverage',
        include: ['src/**/*.js', 'src/**/*.jsx'],
        exclude: ['**/*.test.js', '**/*.test.jsx', 'node_modules/**']
      }
    }
  };
});
