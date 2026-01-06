import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts', './test/setup-a11y.ts'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
    },
  },
});