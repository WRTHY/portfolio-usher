import { test, expect } from './fixtures'

test.describe('automation examples panel', () => {
  test('switching framework changes the file tabs and visible code', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { codeSamples } = portfolioPage

    await expect(codeSamples.fileTab('case-study-modal.spec.ts')).toBeVisible()
    await expect(codeSamples.codeContaining("from '@playwright/test'")).toBeVisible()

    await codeSamples.selectFramework('Cypress')

    await expect(codeSamples.fileTab('case-study-modal.cy.ts')).toBeVisible()
    await expect(codeSamples.fileTab('case-study-modal.spec.ts')).not.toBeVisible()
    await expect(codeSamples.codeContaining("describe('Portfolio")).toBeVisible()
  })

  test('switching file tabs changes the visible code and file path', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { codeSamples } = portfolioPage

    await expect(codeSamples.codeContaining('playwright/case-study-modal.spec.ts')).toBeVisible()

    await codeSamples.selectFile('fixtures.ts')

    await expect(codeSamples.codeContaining('playwright/fixtures.ts')).toBeVisible()
    await expect(codeSamples.codeContaining('export async function openCaseStudy')).toBeVisible()
  })

  test('Python and Java language tabs are disabled and non-interactive', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { codeSamples } = portfolioPage

    const typescriptTab = codeSamples.languageTab('TypeScript')
    const pythonTab = codeSamples.languageTab(/Python/)
    const javaTab = codeSamples.languageTab(/Java/)

    await expect(typescriptTab).toHaveAttribute('aria-selected', 'true')
    await expect(pythonTab).toBeDisabled()
    await expect(javaTab).toBeDisabled()

    // toBeDisabled already confirms clicks can't land, but assert the
    // selection genuinely never moves off TypeScript as well.
    await expect(pythonTab).toHaveAttribute('aria-selected', 'false')
    await expect(javaTab).toHaveAttribute('aria-selected', 'false')
  })
})
