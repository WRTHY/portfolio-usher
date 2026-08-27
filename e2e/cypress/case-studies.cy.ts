import { PortfolioPage } from './pages/PortfolioPage.page'

const CASE_STUDY_ID = 'CS 2'
const CASE_STUDY_TITLE = `Building E2E Test Automation From Zero for Eventric's Flagship Desktop App`

describe('case study modal', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('clicking a tile opens the modal with that case study', () => {
    const { caseStudies } = portfolioPage

    caseStudies.open(CASE_STUDY_ID)

    const { modal } = caseStudies
    modal.dialog.should('be.visible')
    modal.title.should('have.text', CASE_STUDY_TITLE)
  })

  it('Escape closes the modal and returns focus to the trigger', () => {
    const { caseStudies } = portfolioPage

    caseStudies.open(CASE_STUDY_ID)
    caseStudies.modal.dialog.should('be.visible')

    caseStudies.modal.closeWithEscape()
    caseStudies.modal.dialog.should('not.exist')
    // Re-queried fresh here rather than reusing a `trigger` captured before
    // the modal opened — @testing-library/cypress's findBy* queries don't
    // re-resolve against the live DOM on a later, separately-chained
    // .should() the way a plain cy.get() does, so a captured-and-reused
    // reference stays pinned to its very first (pre-open) lookup.
    caseStudies.tile(CASE_STUDY_ID).should('have.focus')
  })

  it('the close button closes the modal and returns focus to the trigger', () => {
    const { caseStudies } = portfolioPage

    caseStudies.open(CASE_STUDY_ID)
    caseStudies.modal.dialog.should('be.visible')

    caseStudies.modal.close()
    caseStudies.modal.dialog.should('not.exist')
    // See the comment in the Escape test above.
    caseStudies.tile(CASE_STUDY_ID).should('have.focus')
  })
})
