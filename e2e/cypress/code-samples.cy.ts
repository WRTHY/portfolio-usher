import { PortfolioPage } from './pages/PortfolioPage'

describe('automation examples panel', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('switching framework changes the file tabs and visible code', () => {
    const { codeSamples } = portfolioPage

    codeSamples.fileTab('case-study-modal.spec.ts').should('be.visible')
    codeSamples.activeCodePanel.should('include.text', "from '@playwright/test'")

    codeSamples.selectFramework('cypress')

    codeSamples.fileTab('case-study-modal.cy.ts').should('be.visible')
    codeSamples.fileTab('case-study-modal.spec.ts').should('not.exist')
    codeSamples.activeCodePanel.should('include.text', "describe('Portfolio")
  })

  it('switching file tabs changes the visible code and file path', () => {
    const { codeSamples } = portfolioPage

    codeSamples.activeFilePath.should('have.text', 'playwright/case-study-modal.spec.ts')

    codeSamples.selectFile('fixtures.ts')

    codeSamples.activeFilePath.should('have.text', 'playwright/fixtures.ts')
    codeSamples.activeCodePanel.should('include.text', 'export async function openCaseStudy')
  })

  it('the Performance testing type is disabled and non-interactive', () => {
    const { codeSamples } = portfolioPage

    codeSamples.testingTypeOption('e2e').should('have.attr', 'data-state', 'checked')
    codeSamples.testingTypeOption('performance').should('be.disabled')

    // be.disabled already confirms clicks can't land, but assert the
    // selection genuinely never moves off e2e as well.
    codeSamples.testingTypeOption('performance').should('have.attr', 'data-state', 'unchecked')
  })
})
