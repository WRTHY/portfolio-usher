import CopyButton from './CopyButton'

// Same tests as CopyButton.test.tsx, in a real browser
describe('CopyButton', () => {
  beforeEach(() => {
    // The runner has no clipboard permission, so stub it.
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
    // Control the clock so we don't wait out the 1.5s reset
    cy.clock()
    cy.mount(<CopyButton text="npx playwright test" />)

    cy.findByRole('button', { name: 'Copy code' }).click()
    cy.findByRole('button', { name: 'Copied' }).should('exist')

    cy.tick(1500)

    cy.findByRole('button', { name: 'Copy code' }).should('exist')
  })
})
