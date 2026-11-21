// The Experience ledger: one row per role, newest first.
export class ExperienceSection {
  get roleHeadings(): Cypress.Chainable<JQuery> {
    return cy.get('#experience').findAllByRole('heading', { level: 3 })
  }

  row(role: string): Cypress.Chainable<JQuery<HTMLLIElement>> {
    return cy.get('#experience').findByRole('heading', { level: 3, name: role }).closest('li')
  }

  tools(role: string): Cypress.Chainable<JQuery> {
    return this.row(role).findByRole('list', { name: `Key tools as ${role}` }).findAllByRole('listitem')
  }
}
