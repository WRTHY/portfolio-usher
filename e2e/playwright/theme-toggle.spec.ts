import { test, expect } from './fixtures'

test.describe('theme toggle', () => {
  test('clicking the toggle flips the theme', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { themeToggle } = portfolioPage

    await themeToggle.toggle()
    const modeAfterFirstClick = await themeToggle.currentMode()
    expect(['light', 'dark']).toContain(modeAfterFirstClick)

    await themeToggle.toggle()
    const modeAfterSecondClick = await themeToggle.currentMode()
    expect(modeAfterSecondClick).toBe(modeAfterFirstClick === 'dark' ? 'light' : 'dark')
  })

  test('the chosen theme persists across a reload', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { themeToggle } = portfolioPage

    await themeToggle.toggle()
    const chosenMode = await themeToggle.currentMode()

    await portfolioPage.page.reload()
    await expect.poll(() => themeToggle.currentMode()).toBe(chosenMode)
    await expect.poll(() => themeToggle.storedMode()).toBe(chosenMode)
  })
})
