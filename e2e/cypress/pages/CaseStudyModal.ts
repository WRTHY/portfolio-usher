// Mirrors the app's generic <Modal>: whatever opens it (right now just
// case studies) can reuse this instead of re-deriving the same testid
// locators of its own.
export class CaseStudyModal {
  get dialog(): Cypress.Chainable<JQuery> {
    return cy.findByTestId('case-study-modal')
  }

  get title(): Cypress.Chainable<JQuery> {
    return this.dialog.findByTestId('case-study-modal-title')
  }

  get closeButton(): Cypress.Chainable<JQuery> {
    return this.dialog.findByTestId('case-study-modal-close')
  }

  close() {
    this.closeButton.click()
  }

  closeWithEscape() {
    cy.get('body').type('{esc}')
  }
}
