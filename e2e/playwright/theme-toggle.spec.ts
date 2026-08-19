import { test, expect } from '@playwright/test'

test.describe('theme toggle', () => {
  test('clicking the toggle flips the theme', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    const toggle = page.getByRole('button', { name: /switch to (light|dark) mode/i })

    await toggle.click()
    const modeAfterFirstClick = await html.getAttribute('data-mode')
    expect(['light', 'dark']).toContain(modeAfterFirstClick)

    await toggle.click()
    await expect(html).toHaveAttribute('data-mode', modeAfterFirstClick === 'dark' ? 'light' : 'dark')
  })

  test('the chosen theme persists across a reload', async ({ page }) => {
    await page.goto('/')
    const html = page.locator('html')
    const toggle = page.getByRole('button', { name: /switch to (light|dark) mode/i })

    await toggle.click()
    const chosenMode = await html.getAttribute('data-mode')

    await page.reload()
    await expect(html).toHaveAttribute('data-mode', chosenMode!)
    await expect.poll(() => page.evaluate(() => localStorage.getItem('mode'))).toBe(chosenMode)
  })
})
