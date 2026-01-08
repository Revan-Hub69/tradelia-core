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
      '@/shared': resolve(__dirname, './src/shared'),
      '@/entities': resolve(__dirname, './src/entities'),
      '@/features': resolve(__dirname, './src/features'),
      '@/widgets': resolve(__dirname, './src/widgets'),
      '@/processes': resolve(__dirname, './src/processes'),
      '@/server': resolve(__dirname, './src/server'),
    },
  },
});