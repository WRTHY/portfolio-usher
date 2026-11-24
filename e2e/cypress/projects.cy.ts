import { PortfolioPage } from './pages/PortfolioPage.page'

describe('projects', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it("the pipeline draws the site's CI in tiers, and each stage opens its code", () => {
    const { projects } = portfolioPage

    projects.stage('e2e').should('have.attr', 'data-state', 'checked')
    projects.activeFileNote.should('have.text', 'Tier 3 of 3 · e2e-tests.yml, called by ci.yml')

    projects.selectStage('unit')
    projects.fileTab('CopyButton.test.tsx').should('be.visible')
    projects.activeFileNote.should('have.text', 'Tier 2 of 3 · unit-tests.yml, called by ci.yml')

    projects.selectStage('component')
    projects.fileTab('CopyButton.cy.tsx').should('be.visible')
    projects.activeFileNote.should('have.text', 'Tier 2 of 3 · component-tests.yml, called by ci.yml')

    // The first tier has no tests of its own: its lint rules, then its workflow.
    projects.selectStage('static')
    projects.activeFilePath.should('have.text', 'eslint.config.js')
    projects.activeFileNote.should('have.text', 'Tier 1 of 3 · lint-and-build.yml, called by ci.yml')

    // The first node is the pipeline file, which runs the tiers.
    projects.selectStage('pipeline')
    projects.activeFilePath.should('have.text', '.github/workflows/ci.yml')
    projects.activeCodePanel.should('include.text', 'needs: [unit, component]')
  })

  it('the index opens only the project it names, at the top of the page', () => {
    const { projects } = portfolioPage
    // Where a project lands: its top just under the sticky bar.
    const landedAtTop = ($project: JQuery) => {
      const element = $project[0]
      const { scrollMarginTop } = element.ownerDocument.defaultView!.getComputedStyle(element)
      const offset = element.getBoundingClientRect().top - parseFloat(scrollMarginTop)
      expect(Math.abs(offset)).to.be.lessThan(2)
    }

    projects.indexLink(/API/).click()

    projects.apiToggle.should('have.attr', 'aria-expanded', 'true')
    projects.siteToggle.should('have.attr', 'aria-expanded', 'false')
    projects.apiProject.should(landedAtTop)

    projects.indexLink(/tests itself/).click()

    projects.siteToggle.should('have.attr', 'aria-expanded', 'true')
    projects.apiToggle.should('have.attr', 'aria-expanded', 'false')
    projects.siteProject.should(landedAtTop)
  })

  it('switching framework changes the file tabs and visible code', () => {
    const { projects } = portfolioPage

    projects.fileTab('case-studies.spec.ts').should('be.visible')
    projects.activeCodePanel.should('include.text', "from './fixtures'")

    projects.selectFramework('cypress')

    projects.fileTab('case-studies.cy.ts').should('be.visible')
    projects.activeCodePanel.should('include.text', 'new PortfolioPage()')
  })

  it('switching file tabs changes the visible code and file path', () => {
    const { projects } = portfolioPage

    projects.activeFilePath.should('have.text', 'e2e/playwright/case-studies.spec.ts')

    projects.selectFile('playwright.config.ts')

    projects.activeFilePath.should('have.text', 'playwright.config.ts')
    projects.activeCodePanel.should('include.text', 'defineConfig')
  })

  it('the API suite sits closed under its own name, and opens to its own code', () => {
    const { projects } = portfolioPage

    projects.apiProject.findByRole('heading', { level: 3 }).should('be.visible')
    projects.apiToggle.should('have.attr', 'aria-expanded', 'false')
    projects.apiActiveCodePanel.should('not.be.visible')

    projects.apiToggle.click()

    projects.apiActiveCodePanel.should('be.visible').and('include.text', 'request.get')

    projects.apiToolOption('postman').click()

    projects.apiActiveCodePanel.should('include.text', 'pm.test')
  })
})
