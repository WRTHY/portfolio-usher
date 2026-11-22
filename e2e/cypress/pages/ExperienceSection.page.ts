// The Experience ledger: one row per role, newest first.
export class ExperienceSection {
  get roleHeadings(): Cypress.Chainable<JQuery> {
    return cy.get('#experience').findAllByRole('heading', { level: 3 })
  }

  row(role: string): Cypress.Chainable<JQuery<HTMLLIElement>> {
    return cy.get('#experience').findByRole('heading', { level: 3, name: role }).closest('li')
  }

  /** How many key tools a role shows (0 when it has none listed). */
  toolCount(role: string): Cypress.Chainable<number> {
    return this.row(role).then((row) => row.find('ul[aria-label^="Key tools"] > li').length)
  }

  /** The row's one-sentence impact line: a plain part of the row to click. */
  impact(role: string): Cypress.Chainable<JQuery> {
    return this.row(role).find('p:not([data-graph-anchor])').first()
  }

  /** The row's "+", which opens its detail bullets and full stack. */
  toggle(role: string): Cypress.Chainable<JQuery> {
    return this.row(role).findByRole('button', { name: `Details: ${role}` })
  }

  /** The git-graph rail down the ledger's left edge (decorative SVG). */
  get graph(): Cypress.Chainable<JQuery> {
    return cy.get('#experience [data-testid="career-graph"]')
  }

  graphNode(id: string): Cypress.Chainable<JQuery> {
    return this.graph.find(`circle[data-node="${id}"]`)
  }

  /** The rest of the role's stack, which unfolds under its key tools. */
  moreTools(role: string): Cypress.Chainable<JQuery> {
    return this.row(role).find(`ul[aria-label="More tools as ${role}"]`)
  }

  // A plain selector, so specs can assert both its hidden and shown states.
  details(role: string): Cypress.Chainable<JQuery> {
    return this.row(role).find(`ul[aria-label="What I did as ${role}"]`)
  }
}
