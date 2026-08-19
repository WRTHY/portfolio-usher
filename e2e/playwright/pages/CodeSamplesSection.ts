import type { Locator, Page } from '@playwright/test'

export type Framework = 'Playwright' | 'Cypress'

export class CodeSamplesSection {
  readonly panel: Locator

  constructor(page: Page) {
    this.panel = page.locator('#code-samples')
  }

  frameworkTab(name: Framework): Locator {
    return this.panel.getByRole('tab', { name })
  }

  // Accepts a RegExp for Python/Java: their accessible name is the
  // language plus a concatenated "soon" badge (e.g. "Pythonsoon").
  languageTab(name: string | RegExp): Locator {
    return this.panel.getByRole('tab', { name })
  }

  fileTab(filename: string): Locator {
    return this.panel.getByRole('tab', { name: filename })
  }

  codeContaining(text: string): Locator {
    return this.panel.getByText(text)
  }

  async selectFramework(name: Framework) {
    await this.frameworkTab(name).click()
  }

  async selectFile(filename: string) {
    await this.fileTab(filename).click()
  }
}
