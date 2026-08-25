import { test, expect } from './fixtures'
import { scanForViolations, formatViolations } from './support/axe'

test.describe('accessibility', () => {
  test('the page has no WCAG 2.1 AA violations in its default state', async ({ portfolioPage }) => {
    await portfolioPage.goto()

    const violations = await scanForViolations(portfolioPage.page)
    expect(violations.length, formatViolations(violations)).toBe(0)
  })

  test('the case study modal has no violations while open', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    await portfolioPage.caseStudies.open('CS 1')
    await expect(portfolioPage.caseStudies.modal.dialog).toBeVisible()

    const violations = await scanForViolations(portfolioPage.page)
    expect(violations.length, formatViolations(violations)).toBe(0)
  })

  test('dark mode has no additional contrast violations', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    await portfolioPage.themeToggle.toggle()
    // InfoPanel's background-color transition runs 0.6s (see
    // InfoPanel.module.css) — scanning before it settles catches axe
    // mid-crossfade and flags transitional colors that never render.
    await portfolioPage.page.waitForTimeout(700)

    const violations = await scanForViolations(portfolioPage.page)
    expect(violations.length, formatViolations(violations)).toBe(0)
  })

  test.describe('mobile viewport', () => {
    test.use({ viewport: { width: 375, height: 812 } })

    test('the mobile nav menu has no violations while open', async ({ portfolioPage }) => {
      await portfolioPage.goto()
      await portfolioPage.nav.openMenu()

      const violations = await scanForViolations(portfolioPage.page)
      expect(violations.length, formatViolations(violations)).toBe(0)
    })
  })
})
