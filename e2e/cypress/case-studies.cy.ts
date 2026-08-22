import { PortfolioPage } from './pages/PortfolioPage'

const CASE_STUDY_ONE = /Placeholder case study one/

describe('case study modal', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('clicking a tile opens the modal with that case study', () => {
    const { caseStudies } = portfolioPage

    caseStudies.open(CASE_STUDY_ONE)

    const { modal } = caseStudies
    modal.dialog.should('be.visible')
    modal.heading('Placeholder case study one').should('be.visible')
    modal.dialog.contains('Placeholder').should('be.visible')
  })

  it('Escape closes the modal and returns focus to the trigger', () => {
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ONE)

    caseStudies.open(CASE_STUDY_ONE)
    caseStudies.modal.dialog.should('be.visible')

    caseStudies.modal.closeWithEscape()
    caseStudies.modal.dialog.should('not.exist')
    trigger.should('have.focus')
  })

  it('the close button closes the modal and returns focus to the trigger', () => {
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ONE)

    caseStudies.open(CASE_STUDY_ONE)
    caseStudies.modal.dialog.should('be.visible')

    caseStudies.modal.close()
    caseStudies.modal.dialog.should('not.exist')
    trigger.should('have.focus')
  })
})
