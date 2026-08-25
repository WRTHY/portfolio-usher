import type { Locator, Page } from '@playwright/test'

const NAV_LABELS = ['Home', 'Case Studies', 'Automation Examples', 'About'] as const
export type NavLabel = (typeof NAV_LABELS)[number]

// Wraps the header <nav>. The sidebar's dot navigation exposes the same
// accessible names (aria-label per section) as these links, so every
// locator here is scoped to the <nav> landmark to stay unambiguous.
export class NavComponent {
  private readonly page: Page
  private readonly nav: Locator

  constructor(page: Page) {
    this.page = page
    this.nav = page.getByRole('navigation')
  }

  link(label: NavLabel): Locator {
    return this.nav.getByRole('link', { name: label })
  }

  async goTo(label: NavLabel) {
    await this.link(label).click()
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
