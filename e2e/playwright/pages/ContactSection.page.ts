import type { Locator, Page } from '@playwright/test'

// The close at the bottom of the page, and the footer after it
export class ContactSection {
  readonly section: Locator
  readonly email: Locator
  readonly footer: Locator

  constructor(page: Page) {
    this.section = page.locator('#contact')
    this.email = this.section.getByRole('link', { name: /@/ })
    this.footer = page.getByRole('contentinfo')
  }

  link(name: 'LinkedIn' | 'GitHub' | 'Resume'): Locator {
    return this.section.getByRole('listitem').getByRole('link', { name })
  }
}
