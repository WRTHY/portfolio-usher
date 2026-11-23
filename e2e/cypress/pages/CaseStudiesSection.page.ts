// The Case Studies ledger: one outcome-led row per case study, each opening
// its write-up in place.
export class CaseStudiesSection {
  get section(): Cypress.Chainable<JQuery> {
    return cy.get('#case-studies')
  }

  // Rows are looked up by case study id (e.g. 'CS 2') through their test id:
  // a row's visible text is its outcome, title and topics, none of which is
  // as stable a handle as the id callers pass in.
  row(id: string): Cypress.Chainable<JQuery> {
    return cy.findByTestId(`case-study-${id}`)
  }

  /** The row's "+": a disclosure button named for its case study. */
  toggle(id: string): Cypress.Chainable<JQuery> {
    return this.row(id).findByRole('button', { name: /^Read case study:/ })
  }

  /** The full write-up. A plain query, so specs can assert it closed too. */
  writeUp(id: string): Cypress.Chainable<JQuery> {
    return cy.get(`[data-testid="case-study-write-up-${id}"]`)
  }

  /** The control at the end of an open write-up. */
  closeFromEnd(id: string): Cypress.Chainable<JQuery> {
    return this.writeUp(id).findByRole('button', { name: 'Close case study' })
  }

  open(id: string) {
    this.toggle(id).click()
  }
}
