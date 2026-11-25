import { test, expect } from './fixtures'

test.describe('projects', () => {
  test("the pipeline draws the site's CI in tiers, and each stage opens its code", async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { projects } = portfolioPage

    await expect(projects.stage('e2e')).toHaveAttribute('data-state', 'checked')
    await expect(projects.activeFileNote).toHaveText('Tier 3 of 3 · e2e-tests.yml, called by ci.yml')

    await projects.selectStage('unit')
    await expect(projects.fileTab('CopyButton.test.tsx')).toBeVisible()
    await expect(projects.activeFileNote).toHaveText('Tier 2 of 3 · unit-tests.yml, called by ci.yml')

    await projects.selectStage('component')
    await expect(projects.fileTab('CopyButton.cy.tsx')).toBeVisible()
    await expect(projects.activeFileNote).toHaveText('Tier 2 of 3 · component-tests.yml, called by ci.yml')

    // The first tier has no tests of its own: its lint rules, then its workflow.
    await projects.selectStage('static')
    await expect(projects.activeFilePath).toHaveText('eslint.config.js')
    await expect(projects.activeFileNote).toHaveText('Tier 1 of 3 · lint-and-build.yml, called by ci.yml')

    // The first node is the pipeline file, which runs the tiers.
    await projects.selectStage('pipeline')
    await expect(projects.activeFilePath).toHaveText('.github/workflows/ci.yml')
    await expect(projects.activeCodePanel).toContainText('needs: [unit, component]')
  })

  test('the index opens only the project it names, at the top of the page', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { projects } = portfolioPage
    // Where a project lands: its top just under the sticky bar.
    const offsetFromLanding = (project: typeof projects.apiProject) =>
      project.evaluate((element) =>
        Math.abs(element.getBoundingClientRect().top - parseFloat(getComputedStyle(element).scrollMarginTop)),
      )

    await projects.indexLink(/API/).click()

    await expect(projects.apiToggle).toHaveAttribute('aria-expanded', 'true')
    await expect(projects.siteToggle).toHaveAttribute('aria-expanded', 'false')
    await expect.poll(() => offsetFromLanding(projects.apiProject)).toBeLessThan(2)

    await projects.indexLink(/tests itself/).click()

    await expect(projects.siteToggle).toHaveAttribute('aria-expanded', 'true')
    await expect(projects.apiToggle).toHaveAttribute('aria-expanded', 'false')
    await expect.poll(() => offsetFromLanding(projects.siteProject)).toBeLessThan(2)
  })

  test('switching framework changes the file tabs and visible code', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { projects } = portfolioPage

    await expect(projects.fileTab('case-studies.spec.ts')).toBeVisible()
    await expect(projects.activeCodePanel).toContainText("from './fixtures'")

    await projects.selectFramework('cypress')

    await expect(projects.fileTab('case-studies.cy.ts')).toBeVisible()
    await expect(projects.activeCodePanel).toContainText('new PortfolioPage()')
  })

  test('switching file tabs changes the visible code and file path', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { projects } = portfolioPage

    await expect(projects.activeFilePath).toHaveText('e2e/playwright/case-studies.spec.ts')

    await projects.selectFile('playwright.config.ts')

    await expect(projects.activeFilePath).toHaveText('playwright.config.ts')
    await expect(projects.activeCodePanel).toContainText('defineConfig')
  })

  test('the API suite sits closed under its own name, and opens to its own code', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { projects } = portfolioPage

    await expect(projects.apiProject.getByRole('heading', { level: 3 })).toBeVisible()
    await expect(projects.apiToggle).toHaveAttribute('aria-expanded', 'false')
    await expect(projects.apiActiveCodePanel).toBeHidden()

    await projects.apiToggle.click()

    await expect(projects.apiActiveCodePanel).toBeVisible()
    await expect(projects.apiActiveCodePanel).toContainText('request.get')

    await projects.apiToolOption('postman').click()

    await expect(projects.apiActiveCodePanel).toContainText('pm.test')
  })
})
