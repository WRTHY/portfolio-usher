import { CaseStudyModal } from './CaseStudyModal'

export class CaseStudiesSection {
  readonly modal = new CaseStudyModal()

  get section(): Cypress.Chainable<JQuery> {
    return cy.get('#case-studies')
  }

  tile(caseStudyId: string): Cypress.Chainable<JQuery> {
    return cy.findByTestId(`case-study-card-${caseStudyId}`)
  }

  open(caseStudyId: string) {
    this.tile(caseStudyId).click()
  }
}
