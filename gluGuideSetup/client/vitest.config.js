import { defineConfig } from "vitest/config";

export default defineConfig({
    test:{
        environment : 'jsdom',
        include: ['**/*.test.js', '**/*.test.jsx'],
        exclude: ['node_modules'],
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'html'],
            reportsDirectory: './coverage',
            include: ['src/**/*.js', 'src/**/*.jsx'],
            exclude: ['**/*.test.js', '**/*.test.jsx', 'node_modules/**']
        }
    }
});