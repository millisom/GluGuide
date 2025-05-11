import { defineConfig } from "vitest/config";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, './src')
        }
    },
    test: {
        environment: 'jsdom',
        include: ['**/*.test.js', '**/*.test.jsx'],
        exclude: ['node_modules'],
        globals: true,
        setupFiles: ['./setupTests.js'],
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