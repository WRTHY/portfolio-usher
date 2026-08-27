import type { Locator, Page } from '@playwright/test'

export type SectionId = 'about' | 'experience' | 'case-studies' | 'code-samples'

// Two independent navs render the same section ids: InfoPanel's desktop nav
// (visible at >=640px, when Header/the mobile nav is display:none) and this
// hamburger's own mobile nav (visible below 640px). Both tag their links with
// matching data-testids (see InfoPanel.tsx / Nav.tsx) keyed by SectionId, so
// this looks those up directly rather than by accessible name — the ids
// callers pass in ('case-studies') don't match the rendered label text
// ('Case Studies').
export class NavComponent {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  link(id: SectionId): Locator {
    return this.page.getByTestId(`nav-link-desktop-${id}`)
  }

  async goTo(id: SectionId) {
    await this.link(id).click()
  }

  // The mobile nav's links live inside a panel that's display:none when
  // closed, which drops them from the accessibility tree — getByTestId
  // queries the raw DOM instead, so visibility assertions spanning the
  // open/closed toggle still resolve to a real (if hidden) element rather
  // than finding nothing at all.
  mobileLink(id: SectionId): Locator {
    return this.page.getByTestId(`nav-link-mobile-${id}`)
  }

  async mobileGoTo(id: SectionId) {
    await this.mobileLink(id).click()
  }

  // The toggle's accessible name flips between "Open menu" and "Close
  // menu" depending on state, so it's exposed as one dynamic locator
  // rather than two static ones.
  get menuToggle(): Locator {
    return this.page.getByRole('button', { name: /(open|close) menu/i })
  }

  async openMenu() {
    await this.page.getByRole('button', { name: 'Open menu' }).click()
  }

  async closeMenu() {
    await this.page.getByRole('button', { name: 'Close menu' }).click()
  }
}
