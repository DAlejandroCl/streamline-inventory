/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

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
    ],

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
