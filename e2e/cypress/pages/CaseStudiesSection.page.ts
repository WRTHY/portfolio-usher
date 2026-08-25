import { CaseStudyModal } from './CaseStudyModal.page'

export class CaseStudiesSection {
  readonly modal = new CaseStudyModal()

  get section(): Cypress.Chainable<JQuery> {
    return cy.get('#case-studies')
  }

  // Tile buttons have no aria-label — their accessible name is the badge +
  // title + summary text concatenated — so callers match on the title alone.
  tile(title: string | RegExp): Cypress.Chainable<JQuery> {
    return cy.findByRole('button', { name: title })
  }

  open(title: string | RegExp) {
    this.tile(title).click()
  }
}
