// Case studies section - rows are looked up by id, e.g. 'CS 2'
export class CaseStudiesSection {
  get section(): Cypress.Chainable<JQuery> {
    return cy.get('#case-studies')
  }

  row(id: string): Cypress.Chainable<JQuery> {
    return cy.findByTestId(`case-study-${id}`)
  }

  toggle(id: string): Cypress.Chainable<JQuery> {
    return this.row(id).findByRole('button', { name: /^Read case study:/ })
  }

  writeUp(id: string): Cypress.Chainable<JQuery> {
    return cy.get(`[data-testid="case-study-write-up-${id}"]`)
  }

  closeFromEnd(id: string): Cypress.Chainable<JQuery> {
    return this.writeUp(id).findByRole('button', { name: 'Close case study' })
  }

  open(id: string) {
    this.toggle(id).click()
  }
}
