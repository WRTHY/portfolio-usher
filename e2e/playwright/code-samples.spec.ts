import { test, expect } from '@playwright/test'

test.describe('automation examples panel', () => {
  test('switching framework changes the file tabs and visible code', async ({ page }) => {
    await page.goto('/')
    const panel = page.locator('#code-samples')

    await expect(panel.getByRole('tab', { name: 'case-study-modal.spec.ts' })).toBeVisible()
    await expect(panel.getByText("from '@playwright/test'")).toBeVisible()

    await panel.getByRole('tab', { name: 'Cypress' }).click()

    await expect(panel.getByRole('tab', { name: 'case-study-modal.cy.ts' })).toBeVisible()
    await expect(panel.getByRole('tab', { name: 'case-study-modal.spec.ts' })).not.toBeVisible()
    await expect(panel.getByText("describe('Portfolio")).toBeVisible()
  })

  test('switching file tabs changes the visible code and file path', async ({ page }) => {
    await page.goto('/')
    const panel = page.locator('#code-samples')

    await expect(panel.getByText('playwright/case-study-modal.spec.ts')).toBeVisible()

    await panel.getByRole('tab', { name: 'fixtures.ts' }).click()

    await expect(panel.getByText('playwright/fixtures.ts')).toBeVisible()
    await expect(panel.getByText('export async function openCaseStudy')).toBeVisible()
  })

  test('Python and Java language tabs are disabled and non-interactive', async ({ page }) => {
    await page.goto('/')
    const panel = page.locator('#code-samples')

    const typescriptTab = panel.getByRole('tab', { name: 'TypeScript' })
    const pythonTab = panel.getByRole('tab', { name: /Python/ })
    const javaTab = panel.getByRole('tab', { name: /Java/ })

    await expect(typescriptTab).toHaveAttribute('aria-selected', 'true')
    await expect(pythonTab).toBeDisabled()
    await expect(javaTab).toBeDisabled()

    // toBeDisabled already confirms clicks can't land, but assert the
    // selection genuinely never moves off TypeScript as well.
    await expect(pythonTab).toHaveAttribute('aria-selected', 'false')
    await expect(javaTab).toHaveAttribute('aria-selected', 'false')
  })
})
