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
  // Deliberately redundant with the Vitest + React Testing Library suite:
  // same components, same assertions, different runner. It exists so the
  // Component tier of the portfolio's "Automation Examples" panel can offer
  // a real framework choice (Vitest vs Cypress) the same way the E2E tier
  // does (Playwright vs Cypress), not because the coverage was missing.
  // Specs are co-located under src/ next to the components they mount,
  // matching the *.test.tsx convention, rather than living under e2e/ like
  // the E2E specs above.
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
