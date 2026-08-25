import type { Locator, Page } from '@playwright/test'

// Mirrors the app's generic <Modal>: whatever opens it (right now just
// case studies) can reuse this instead of re-deriving the same testid
// locators of its own.
export class CaseStudyModal {
  private readonly page: Page
  readonly dialog: Locator

  constructor(page: Page) {
    this.page = page
    this.dialog = page.getByTestId('case-study-modal')
  }

  get title(): Locator {
    return this.dialog.getByTestId('case-study-modal-title')
  }

  get closeButton(): Locator {
    return this.dialog.getByTestId('case-study-modal-close')
  }

  async close() {
    await this.closeButton.click()
  }

  async closeWithEscape() {
    await this.page.keyboard.press('Escape')
  }
}
