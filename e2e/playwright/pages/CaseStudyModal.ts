import type { Locator, Page } from '@playwright/test'

// Mirrors the app's generic <Modal>: whatever opens it (right now just
// case studies) can reuse this instead of re-deriving the same
// role="dialog" / close-button locators of its own.
export class CaseStudyModal {
  private readonly page: Page
  readonly dialog: Locator

  constructor(page: Page) {
    this.page = page
    this.dialog = page.getByRole('dialog')
  }

  heading(title: string): Locator {
    return this.dialog.getByRole('heading', { name: title })
  }

  get closeButton(): Locator {
    return this.dialog.getByRole('button', { name: 'Close' })
  }

  async close() {
    await this.closeButton.click()
  }

  async closeWithEscape() {
    await this.page.keyboard.press('Escape')
  }
}
