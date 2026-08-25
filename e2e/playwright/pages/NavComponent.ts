import type { Locator, Page } from '@playwright/test'

export type SectionId = 'about' | 'experience' | 'case-studies' | 'code-samples'

// The app renders two separate nav UIs that are never both visible at once
// (Header.module.css / InfoPanel.module.css split display:none on opposite
// sides of the 640px breakpoint): a hamburger menu for mobile, and the
// sidebar "Sections" list for desktop. A role query naturally picked
// whichever one the accessibility tree currently exposed, but a testid
// query has no such filtering — so each gets its own testid rather than
// sharing one, and callers pick the variant that matches their viewport.
export class NavComponent {
  private readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  link(sectionId: SectionId): Locator {
    return this.page.getByTestId(`nav-link-desktop-${sectionId}`)
  }

  async goTo(sectionId: SectionId) {
    await this.link(sectionId).click()
  }

  mobileLink(sectionId: SectionId): Locator {
    return this.page.getByTestId(`nav-link-mobile-${sectionId}`)
  }

  async mobileGoTo(sectionId: SectionId) {
    await this.mobileLink(sectionId).click()
  }

  get menuToggle(): Locator {
    return this.page.getByTestId('menu-toggle')
  }

  async openMenu() {
    await this.menuToggle.click()
  }

  async closeMenu() {
    await this.menuToggle.click()
  }
}
