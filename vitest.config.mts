import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'tests/unit/**/*.test.{ts,tsx}',
      'tests/integration/**/*.int.test.{ts,tsx}',
      'tests/int/**/*.int.spec.ts', // Backward compatibility
    ],
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**', '**/.next/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.d.ts',
        '**/*.config.{js,ts,mjs,mts}',
        '**/coverage/**',
        'src/app/(payload)/**', // Exclude Payload admin UI
        'src/endpoints/seed/**', // Exclude seed data
        'scripts/**',
        'public/**',
      ],
      include: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70,
        },
      },
    },
    globals: true,
    testTimeout: 10000,
    hookTimeout: 10000,
  },
})
