import type { Locator, Page } from '@playwright/test'

export class ThemeToggleComponent {
  private readonly page: Page
  private readonly html: Locator
  readonly button: Locator

  constructor(page: Page) {
    this.page = page
    this.html = page.locator('html')
    this.button = page.getByTestId('theme-toggle')
  }

  async toggle() {
    await this.button.click()
  }

  currentMode(): Promise<string | null> {
    return this.html.getAttribute('data-mode')
  }

  storedMode(): Promise<string | null> {
    return this.page.evaluate(() => localStorage.getItem('mode'))
  }
}
