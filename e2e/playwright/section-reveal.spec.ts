import type { Locator } from '@playwright/test'
import { test, expect } from './fixtures'

// The section transition (PortfolioTemplate.module.css) is scroll-linked: a
// section is only part-way revealed while its top is near the bottom of the
// viewport. These park a section there and read the computed styles, since
// that's the only place a half-hidden title would show up.
const SECTIONS = ['experience', 'case-studies', 'projects', 'contact'] as const

// Where a section's top sits, as a share of the viewport height: inside the
// reveal window, and well past it.
const MID_REVEAL = 0.75
const REVEALED = 0.2

function revealState(section: Locator) {
  return section.evaluate((element) => {
    const heading = element.querySelector('h2')!
    const firstPiece = element.firstElementChild!
    // A hill can live on either pseudo-element, so read both (the other
    // one is an empty runway when it's used at all).
    const hill =
      ['::before', '::after']
        .map((pseudo) => getComputedStyle(element, pseudo).animationName)
        .filter((name) => name !== 'none')
        .join(', ') || 'none'
    return {
      hill,
      headingAnimation: getComputedStyle(heading).animationName,
      headingFilter: getComputedStyle(heading).filter,
      pieceMask: getComputedStyle(firstPiece).maskImage,
    }
  })
}

test.describe('section reveal', () => {
  test('a section part-way into view is still revealing', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    await portfolioPage.scrollSectionTopTo('experience', MID_REVEAL)

    const state = await revealState(portfolioPage.section('experience'))
    expect(state.headingFilter).toMatch(/blur/)
    expect(state.pieceMask).toMatch(/gradient/)
  })

  test('the violet field blends into the section after it as that section arrives', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    await portfolioPage.scrollSectionTopTo('case-studies', MID_REVEAL)

    const state = await revealState(portfolioPage.section('case-studies'))
    expect(state.hill).not.toBe('none')
  })

  test('a section scrolled past the reveal is drawn normally', async ({ portfolioPage }) => {
    await portfolioPage.goto()

    for (const id of SECTIONS) {
      // By its title, so the check doesn't depend on how much empty runway
      // a section has around the violet field.
      await portfolioPage.page
        .locator(`#${id}-heading`)
        .evaluate((heading, at) =>
          window.scrollTo({
            top: heading.getBoundingClientRect().top + window.scrollY - window.innerHeight * at,
            behavior: 'instant',
          }),
        REVEALED)
      const state = await revealState(portfolioPage.page.locator(`#${id}`))
      expect(state.headingFilter, id).toBe('none')
      expect(state.pieceMask, id).toBe('none')
    }
  })

  test('keyboard focus inside a revealing section shows it at once', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    await portfolioPage.scrollSectionTopTo('contact', MID_REVEAL)
    // preventScroll keeps the section parked mid-reveal, where tabbing to
    // it would leave it.
    await portfolioPage.contact.email.evaluate((link: HTMLElement) => link.focus({ preventScroll: true }))

    const state = await revealState(portfolioPage.contact.section)
    expect(state.hill).toBe('none')
    expect(state.headingAnimation).toBe('none')
    expect(state.pieceMask).toBe('none')
  })

  test.describe('with reduced motion', () => {
    // Through contextOptions: the top-level reducedMotion option doesn't
    // reach the page in this Playwright version, and the test would then
    // pass without ever emulating the preference.
    test.use({ contextOptions: { reducedMotion: 'reduce' } })

    test('the page really prefers reduced motion', async ({ portfolioPage }) => {
      await portfolioPage.goto()
      const matches = await portfolioPage.page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches)
      expect(matches).toBe(true)
    })

    test('every section is shown immediately, with no reveal', async ({ portfolioPage }) => {
      await portfolioPage.goto()

      for (const id of SECTIONS) {
        await portfolioPage.scrollSectionTopTo(id, MID_REVEAL)
        const state = await revealState(portfolioPage.page.locator(`#${id}`))
        expect(state, id).toEqual({ hill: 'none', headingAnimation: 'none', headingFilter: 'none', pieceMask: 'none' })
      }
    })
  })
})
