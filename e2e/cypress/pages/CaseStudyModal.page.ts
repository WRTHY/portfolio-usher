// Mirrors the app's generic <Modal>: whatever opens it (right now just
// case studies) can reuse this instead of re-deriving the same
// role="dialog" / close-button locators of its own.
export class CaseStudyModal {
  get dialog(): Cypress.Chainable<JQuery> {
    return cy.findByRole('dialog')
  }

  heading(title: string): Cypress.Chainable<JQuery> {
    return this.dialog.findByRole('heading', { name: title })
  }

  get title(): Cypress.Chainable<JQuery> {
    return this.dialog.findByTestId('case-study-modal-title')
  }

  get closeButton(): Cypress.Chainable<JQuery> {
    return this.dialog.findByRole('button', { name: 'Close' })
  }

  close() {
    this.closeButton.click()
  }

  closeWithEscape() {
    cy.get('body').type('{esc}')
  }
}
