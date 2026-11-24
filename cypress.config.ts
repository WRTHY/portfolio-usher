import { defineConfig } from 'cypress'

export default defineConfig({
  // Same as Playwright - retries in CI only
  retries: { runMode: 2, openMode: 0 },
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'e2e/cypress/**/*.cy.ts',
    supportFile: 'e2e/cypress/support/e2e.ts',
    fixturesFolder: false,
    setupNodeEvents() {},
  },
  // Same components as the Vitest suite, run in a real browser
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.tsx',
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
    fixturesFolder: false,
  },
})
