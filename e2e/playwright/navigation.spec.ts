import { test, expect } from './fixtures'

test.describe('primary navigation', () => {
  test('each nav link scrolls its section into view', async ({ portfolioPage }) => {
    await portfolioPage.goto()

    await portfolioPage.nav.goTo('case-studies')
    await expect(portfolioPage.section('case-studies')).toBeInViewport()

    await portfolioPage.nav.goTo('code-samples')
    await expect(portfolioPage.section('code-samples')).toBeInViewport()

    await portfolioPage.nav.goTo('experience')
    await expect(portfolioPage.section('experience')).toBeInViewport()

    await portfolioPage.nav.goTo('about')
    await expect(portfolioPage.section('about')).toBeInViewport()
  })
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('the menu toggle opens and closes the nav', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { nav } = portfolioPage

    await expect(nav.mobileLink('about')).not.toBeVisible()

    await nav.openMenu()
    await expect(nav.menuToggle).toHaveAccessibleName('Close menu')
    await expect(nav.mobileLink('about')).toBeVisible()

    await nav.closeMenu()
    await expect(nav.menuToggle).toHaveAccessibleName('Open menu')
    await expect(nav.mobileLink('about')).not.toBeVisible()
  })

  test('choosing a link closes the menu and scrolls to the section', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { nav } = portfolioPage

    await nav.openMenu()
    await nav.mobileGoTo('about')

    await expect(portfolioPage.section('about')).toBeInViewport()
    await expect(nav.menuToggle).toHaveAccessibleName('Open menu')
  })
})
