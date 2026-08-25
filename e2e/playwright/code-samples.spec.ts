import { test, expect } from './fixtures'

test.describe('automation examples panel', () => {
  test('switching framework changes the file tabs and visible code', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { codeSamples } = portfolioPage

    await expect(codeSamples.fileTab('case-studies.spec.ts')).toBeVisible()
    await expect(codeSamples.activeCodePanel).toContainText("from './fixtures'")

    await codeSamples.selectFramework('cypress')

    await expect(codeSamples.fileTab('case-studies.cy.ts')).toBeVisible()
    await expect(codeSamples.activeCodePanel).toContainText('new PortfolioPage()')
  })

  test('switching file tabs changes the visible code and file path', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { codeSamples } = portfolioPage

    await expect(codeSamples.activeFilePath).toHaveText('playwright/case-studies.spec.ts')

    await codeSamples.selectFile('playwright.config.ts')

    await expect(codeSamples.activeFilePath).toHaveText('playwright.config.ts')
    await expect(codeSamples.activeCodePanel).toContainText('defineConfig')
  })

  test('the Performance testing type is disabled and non-interactive', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { codeSamples } = portfolioPage

    await expect(codeSamples.testingTypeOption('e2e')).toHaveAttribute('data-state', 'checked')
    await expect(codeSamples.testingTypeOption('performance')).toBeDisabled()

    // toBeDisabled already confirms clicks can't land, but assert the
    // selection genuinely never moves off e2e as well.
    await expect(codeSamples.testingTypeOption('performance')).toHaveAttribute(
      'data-state',
      'unchecked',
    )
  })
})
