import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Only run files under tests/unit — Playwright specs live elsewhere
    include: ['tests/unit/**/*.spec.ts'],
    environment: 'node',
    reporters: ['verbose'],
    coverage: {
      provider: 'v8',
      include: ['src/utils/**'],
    },
  },
  resolve: {
    alias: {
      '@pages': '/src/pages',
      '@api': '/src/api',
      '@fixtures': '/src/fixtures',
      '@data': '/src/data',
    },
  },
});
