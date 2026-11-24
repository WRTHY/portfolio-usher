import { test, expect } from './fixtures'

test.describe('primary navigation', () => {
  // The bar's inline section links only show from 1024px up (below that they
  // live in the hamburger menu). Pinned explicitly rather than relying on the
  // project's default viewport, mirroring the mobile block below.
  test.use({ viewport: { width: 1280, height: 720 } })

  test('each nav link scrolls its section into view', async ({ portfolioPage }) => {
    await portfolioPage.goto()

    await portfolioPage.nav.goTo('case-studies')
    await expect(portfolioPage.section('case-studies')).toBeInViewport()

    await portfolioPage.nav.goTo('projects')
    await expect(portfolioPage.section('projects')).toBeInViewport()

    await portfolioPage.nav.goTo('experience')
    await expect(portfolioPage.section('experience')).toBeInViewport()

    await portfolioPage.nav.goTo('case-studies')
    await expect(portfolioPage.section('case-studies')).toBeInViewport()
  })

  test("the bar's Let's talk pill jumps to the contact close", async ({ portfolioPage }) => {
    await portfolioPage.goto()

    await portfolioPage.page.getByRole('banner').getByRole('link', { name: 'Let’s talk' }).click()
    await expect(portfolioPage.contact.section).toBeInViewport()
  })

  test('at the hero nothing in the bar is marked, and the rail marks the hero itself', async ({ portfolioPage }) => {
    await portfolioPage.goto()

    await expect(portfolioPage.page.getByRole('banner').locator('[aria-current]')).toHaveCount(0)
    await expect(portfolioPage.rail.getByRole('link', { name: 'Intro' })).toHaveAttribute('aria-current', 'true')

    await portfolioPage.scrollSectionToTop('experience')
    await expect(portfolioPage.rail.getByRole('link', { name: 'Experience' })).toHaveAttribute('aria-current', 'true')
  })

  test('the left rail switches to readable colours over the violet section', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    // Dots, theme toggle and socials each switch on their own.
    await expect(portfolioPage.railPartsOnAccent).toHaveCount(0)

    await portfolioPage.scrollSectionToTop('projects')
    await expect(portfolioPage.railPartsOnAccent).toHaveCount(3)

    await portfolioPage.scrollSectionToTop('experience')
    await expect(portfolioPage.railPartsOnAccent).toHaveCount(0)
  })
})

test.describe('rail socials', () => {
  test('fade out at the contact close, which has the same links, and back in above it', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    await expect(portfolioPage.railSocials).toHaveCSS('opacity', '1')

    await portfolioPage.contact.section.scrollIntoViewIfNeeded()
    await expect(portfolioPage.railSocials).toHaveCSS('opacity', '0')

    await portfolioPage.scrollSectionToTop('experience')
    await expect(portfolioPage.railSocials).toHaveCSS('opacity', '1')
  })
})

test.describe('mobile navigation', () => {
  test.use({ viewport: { width: 375, height: 812 } })

  test('the menu toggle opens and closes the nav', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { nav } = portfolioPage

    await expect(nav.mobileLink('experience')).not.toBeVisible()

    await nav.openMenu()
    await expect(nav.menuToggle).toHaveAccessibleName('Close menu')
    await expect(nav.mobileLink('experience')).toBeVisible()

    await nav.closeMenu()
    await expect(nav.menuToggle).toHaveAccessibleName('Open menu')
    await expect(nav.mobileLink('experience')).not.toBeVisible()
  })

  test('choosing a link closes the menu and scrolls to the section', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { nav } = portfolioPage

    await nav.openMenu()
    await nav.mobileGoTo('experience')

    await expect(portfolioPage.section('experience')).toBeInViewport()
    await expect(nav.menuToggle).toHaveAccessibleName('Open menu')
  })
})
