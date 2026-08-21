import { PortfolioPage } from './pages/PortfolioPage'

describe('automation examples panel', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('switching framework changes the file tabs and visible code', () => {
    const { codeSamples } = portfolioPage

    codeSamples.fileTab('case-study-modal.spec.ts').should('be.visible')
    codeSamples.codeContaining("from '@playwright/test'").should('be.visible')

    codeSamples.selectFramework('Cypress')

    codeSamples.fileTab('case-study-modal.cy.ts').should('be.visible')
    codeSamples.fileTab('case-study-modal.spec.ts').should('not.exist')
    codeSamples.codeContaining("describe('Portfolio").should('be.visible')
  })

  it('switching file tabs changes the visible code and file path', () => {
    const { codeSamples } = portfolioPage

    codeSamples.codeContaining('playwright/case-study-modal.spec.ts').should('be.visible')

    codeSamples.selectFile('fixtures.ts')

    codeSamples.codeContaining('playwright/fixtures.ts').should('be.visible')
    codeSamples.codeContaining('export async function openCaseStudy').should('be.visible')
  })

  it('Python and Java language options are disabled and non-interactive', () => {
    const { codeSamples } = portfolioPage

    const typescriptOption = codeSamples.languageOption('TypeScript')
    const pythonOption = codeSamples.languageOption(/Python/)
    const javaOption = codeSamples.languageOption(/Java/)

    typescriptOption.should('have.attr', 'aria-checked', 'true')
    pythonOption.should('be.disabled')
    javaOption.should('be.disabled')

    // be.disabled already confirms clicks can't land, but assert the
    // selection genuinely never moves off TypeScript as well.
    pythonOption.should('have.attr', 'aria-checked', 'false')
    javaOption.should('have.attr', 'aria-checked', 'false')
  })
})
