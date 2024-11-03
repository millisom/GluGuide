import { defineConfig } from "vitest/config";

export default defineConfig({
    test:{
        environment : 'jsdom',
        include: ['**/*.test.js', '**/*.test.jsx'],
        exclude: ['node_modules'],
        globals: true
    }
});