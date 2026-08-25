import { PortfolioPage } from './pages/PortfolioPage.page'

describe('automation examples panel', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('switching framework changes the file tabs and visible code', () => {
    const { codeSamples } = portfolioPage

    codeSamples.fileTab('case-studies.spec.ts').should('be.visible')
    codeSamples.activeCodePanel.should('include.text', "from './fixtures'")

    codeSamples.selectFramework('cypress')

    codeSamples.fileTab('case-studies.cy.ts').should('be.visible')
    codeSamples.activeCodePanel.should('include.text', 'new PortfolioPage()')
  })

  it('switching file tabs changes the visible code and file path', () => {
    const { codeSamples } = portfolioPage

    codeSamples.activeFilePath.should('have.text', 'playwright/case-studies.spec.ts')

    codeSamples.selectFile('playwright.config.ts')

    codeSamples.activeFilePath.should('have.text', 'playwright.config.ts')
    codeSamples.activeCodePanel.should('include.text', 'defineConfig')
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
