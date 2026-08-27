import { CaseStudyModal } from './CaseStudyModal.page'

export class CaseStudiesSection {
  readonly modal = new CaseStudyModal()

  get section(): Cypress.Chainable<JQuery> {
    return cy.get('#case-studies')
  }

  // Tile buttons have no aria-label — their accessible name is the badge +
  // title + summary text concatenated, not the case study id callers pass
  // in (e.g. 'CS 2') — so this looks up the card's data-testid instead
  // (see CaseStudies.tsx: `case-study-card-${caseStudy.id}`).
  tile(id: string): Cypress.Chainable<JQuery> {
    return cy.findByTestId(`case-study-card-${id}`)
  }

  open(id: string) {
    this.tile(id).click()
  }
}
