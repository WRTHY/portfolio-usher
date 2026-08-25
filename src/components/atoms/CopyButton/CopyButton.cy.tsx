import CopyButton from './CopyButton'

// Deliberately redundant with CopyButton.test.tsx (Vitest + React Testing
// Library): same component, same three behaviors, run through Cypress's
// real-browser mount instead of jsdom. That's the point — the Component
// tier of the portfolio's "Automation Examples" panel offers a Vitest vs.
// Cypress choice the same way the E2E tier offers Playwright vs. Cypress.
// Featured verbatim as the Component/Cypress example in codeExamples.ts —
// keep this file's content and that copy in sync if either changes.
describe('CopyButton', () => {
  beforeEach(() => {
    // Real Chrome's navigator.clipboard needs OS-level permission (and a
    // secure context) to actually write, neither of which the component
    // test runner grants — stub it the same way the Vitest test stubs
    // jsdom's copy.
    cy.window().then((win) => {
      const writeText = cy.stub().as('writeText').resolves()
      Object.defineProperty(win.navigator, 'clipboard', {
        configurable: true,
        value: { writeText },
      })
    })
  })

  it('mounts with a "Copy code" label', () => {
    cy.mount(<CopyButton text="npx playwright test" />)
    cy.findByRole('button', { name: 'Copy code' }).should('exist')
  })

  it('copies its text to the clipboard on click', () => {
    cy.mount(<CopyButton text="npx playwright test" />)

    cy.findByRole('button', { name: 'Copy code' }).click()

    cy.get('@writeText').should('have.been.calledWith', 'npx playwright test')
  })

  it('flips its label to "Copied" and back after ~1500ms', () => {
    cy.clock()
    cy.mount(<CopyButton text="npx playwright test" />)

    cy.findByRole('button', { name: 'Copy code' }).click()
    cy.findByRole('button', { name: 'Copied' }).should('exist')

    cy.tick(1500)

    cy.findByRole('button', { name: 'Copy code' }).should('exist')
  })
})
