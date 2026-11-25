// The close at the bottom of the page, and the footer after it
export class ContactSection {
  get section(): Cypress.Chainable<JQuery> {
    return cy.get('#contact')
  }

  get email(): Cypress.Chainable<JQuery> {
    return this.section.findByRole('link', { name: /@/ })
  }

  get footer(): Cypress.Chainable<JQuery> {
    return cy.findByRole('contentinfo')
  }

  link(name: 'LinkedIn' | 'GitHub' | 'Resume'): Cypress.Chainable<JQuery> {
    return this.section.findByRole('list').findByRole('link', { name })
  }
}
