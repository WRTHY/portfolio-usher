import type { Locator, Page } from '@playwright/test'

export type Framework = 'Playwright' | 'Cypress'

export class CodeSamplesSection {
  readonly panel: Locator

  constructor(page: Page) {
    this.panel = page.locator('#code-samples')
  }

  // Framework/language pickers are a RadioGroup (role="radio"), not Tabs —
  // they select a value rather than owning a tabpanel of their own. Only
  // the file picker below is genuine Tabs, since it actually swaps panels.
  frameworkOption(name: Framework): Locator {
    return this.panel.getByRole('radio', { name })
  }

  // Accepts a RegExp for Python/Java: their accessible name is the
  // language plus a concatenated "soon" badge (e.g. "Pythonsoon").
  languageOption(name: string | RegExp): Locator {
    return this.panel.getByRole('radio', { name })
  }

  fileTab(filename: string): Locator {
    return this.panel.getByRole('tab', { name: filename })
  }

  codeContaining(text: string): Locator {
    return this.panel.getByText(text)
  }

  async selectFramework(name: Framework) {
    await this.frameworkOption(name).click()
  }

  async selectFile(filename: string) {
    await this.fileTab(filename).click()
  }
}
