import { PortfolioPage } from './pages/PortfolioPage.page'

const CASE_STUDY_ID = 'CS 2'
const CASE_STUDY_TITLE = `Building E2E Test Automation From Zero for Eventric's Flagship Desktop App`

describe('case studies', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  // Closed by default - just the outcome and title
  it('a row leads with its outcome, and keeps the write-up closed', () => {
    const { caseStudies } = portfolioPage

    caseStudies.row(CASE_STUDY_ID).findByRole('heading', { level: 3 }).should('have.text', CASE_STUDY_TITLE)
    caseStudies.row(CASE_STUDY_ID).should('contain.text', '4 hrs → 10 min')
    caseStudies.toggle(CASE_STUDY_ID).should('have.attr', 'aria-expanded', 'false')
    caseStudies.writeUp(CASE_STUDY_ID).should('not.be.visible')
  })

  // Every write-up should have the same four parts
  it('the "+" opens the write-up in place, and closes it again', () => {
    const { caseStudies } = portfolioPage

    caseStudies.open(CASE_STUDY_ID)

    caseStudies.toggle(CASE_STUDY_ID).should('have.attr', 'aria-expanded', 'true')
    caseStudies.writeUp(CASE_STUDY_ID).should('be.visible')
    caseStudies
      .writeUp(CASE_STUDY_ID)
      .findAllByRole('heading', { level: 4 })
      .then((headings) => {
        expect([...headings].map((heading) => heading.textContent)).to.deep.equal([
          'Problem',
          'Approach',
          'Outcome',
          'Future iterations',
        ])
      })

    caseStudies.toggle(CASE_STUDY_ID).click()
    caseStudies.writeUp(CASE_STUDY_ID).should('not.be.visible')
  })

  // Close button at the bottom of a long write-up - focus and scroll go back to the row
  it('closing from the end of a write-up returns focus and the view to its row', () => {
    const { caseStudies } = portfolioPage

    caseStudies.open(CASE_STUDY_ID)
    caseStudies.closeFromEnd(CASE_STUDY_ID).click()

    caseStudies.writeUp(CASE_STUDY_ID).should('not.be.visible')
    caseStudies.toggle(CASE_STUDY_ID).should('have.focus')
    caseStudies.row(CASE_STUDY_ID).should(($row) => {
      const { top } = $row[0].getBoundingClientRect()
      expect(top).to.be.within(0, Cypress.config('viewportHeight'))
    })
  })
})
