import { PortfolioPage } from './pages/PortfolioPage'

const CASE_STUDY_ID = 'CS 1'
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
    const trigger = caseStudies.tile(CASE_STUDY_ID)

    caseStudies.open(CASE_STUDY_ID)
    caseStudies.modal.dialog.should('be.visible')

    caseStudies.modal.closeWithEscape()
    caseStudies.modal.dialog.should('not.exist')
    trigger.should('have.focus')
  })

  it('the close button closes the modal and returns focus to the trigger', () => {
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ID)

    caseStudies.open(CASE_STUDY_ID)
    caseStudies.modal.dialog.should('be.visible')

    caseStudies.modal.close()
    caseStudies.modal.dialog.should('not.exist')
    trigger.should('have.focus')
  })
})
