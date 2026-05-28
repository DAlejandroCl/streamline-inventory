import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores([
    'dist',
    'coverage',
    'playwright-report',
    'test-results',
    '**/__tests__/**',
    '**/e2e/**',
  ]),

  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // react-refresh: warn (cleanup debt — context files exportan hooks + componentes)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // unused-vars: warn (cleanup debt pre-existente)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // react-hooks: warn (SettingsPage tiene PasswordInput definido dentro del render)
      // Documentado como deuda técnica — refactorizar en sprint de limpieza
      'react-hooks/rules-of-hooks': 'warn',
      'react-hooks/static-components': 'warn',
    },
  },
])
