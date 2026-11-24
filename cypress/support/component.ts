import { mount } from 'cypress/react'
import '@testing-library/cypress/add-commands'
import '../../src/index.css'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

// cy.mount for component tests
Cypress.Commands.add('mount', mount)
