import { mount } from 'cypress/react'
import '@testing-library/cypress/add-commands'
import '../../src/index.css'

declare global {
  // Cypress's own recommended pattern for typing custom commands requires
  // augmenting the global Cypress.Chainable namespace, which only a `declare
  // namespace` block can do.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', mount)
