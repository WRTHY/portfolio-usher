import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import cypress from 'eslint-plugin-cypress'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // React-specific rules only apply to actual React source - e2e/playwright's
  // fixtures.ts has a `use` fixture parameter that eslint-plugin-react-hooks
  // otherwise mistakes for a hook call.
  {
    files: ['src/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
  },
  {
    files: ['e2e/cypress/**/*.ts', 'cypress/**/*.ts', 'src/**/*.cy.tsx', 'cypress.config.ts'],
    extends: [cypress.configs.recommended],
  },
])
