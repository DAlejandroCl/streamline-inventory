/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import { createRequire } from 'node:module'
import path from 'node:path'

// Config exclusiva de Vitest — separada de vite.config.ts para que
// `tsc -b && vite build` no falle al no reconocer el campo `test`

const require = createRequire(import.meta.url)
const react = require('@vitejs/plugin-react').default

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setup/vitest.setup.ts',

    /* Define env vars para tests — import.meta.env.VITE_* */
    env: {
      VITE_API_URL: 'http://localhost:3000',
    },

    /* Excluir archivos que no son tests */
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/*.config.*',
      '**/e2e/**',
    ],

    /* axe-core es un singleton global — no puede correr en paralelo.
       singleFork garantiza que todos los test files comparten el mismo
       proceso Node, eliminando el "Axe is already running" entre workers. */
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'src/main.tsx',
        'src/tests/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/node_modules/**',
      ],
      thresholds: {
        functions: 70,
        lines:     70,
      },
    },
  },
})
