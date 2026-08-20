import { test, expect } from './fixtures'

test.describe('primary navigation', () => {
  test('each nav link scrolls its section into view', async ({ portfolioPage }) => {
    await portfolioPage.goto()

    await portfolioPage.nav.goTo('Case Studies')
    await expect(portfolioPage.section('case-studies')).toBeInViewport()

    await portfolioPage.nav.goTo('Automation Examples')
    await expect(portfolioPage.section('code-samples')).toBeInViewport()

    await portfolioPage.nav.goTo('Experience')
    await expect(portfolioPage.section('experience')).toBeInViewport()

    await portfolioPage.nav.goTo('About')
    await expect(portfolioPage.section('about')).toBeInViewport()
  })
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('the menu toggle opens and closes the nav', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { nav } = portfolioPage

    await expect(nav.link('About')).not.toBeVisible()

    await nav.openMenu()
    await expect(nav.menuToggle).toHaveAccessibleName('Close menu')
    await expect(nav.link('About')).toBeVisible()

    await nav.closeMenu()
    await expect(nav.menuToggle).toHaveAccessibleName('Open menu')
    await expect(nav.link('About')).not.toBeVisible()
  })

  test('choosing a link closes the menu and scrolls to the section', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { nav } = portfolioPage

    await nav.openMenu()
    await nav.goTo('About')

    await expect(portfolioPage.section('about')).toBeInViewport()
    await expect(nav.menuToggle).toHaveAccessibleName('Open menu')
  })
})
