import { defineConfig } from "vitest/config";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import react from '@vitejs/plugin-react';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            'react': resolve(__dirname, './node_modules/react')
        }
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
});