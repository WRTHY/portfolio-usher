import { defineConfig } from 'cypress'

export default defineConfig({
  // Scoped to its own subfolder alongside e2e/playwright: e2e/ holds sibling
  // implementations of the same test scenarios in other frameworks/languages
  // (Cypress here, Python/Java later).
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'e2e/cypress/**/*.cy.ts',
    supportFile: 'e2e/cypress/support/e2e.ts',
    fixturesFolder: false,
    setupNodeEvents() {},
  },
})
