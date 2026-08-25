import type { Locator, Page } from '@playwright/test'

export type TestingType = 'e2e' | 'component' | 'performance'
export type Framework = 'playwright' | 'cypress' | 'playwright-ct' | 'cypress-ct'

export class CodeSamplesSection {
  readonly panel: Locator

  constructor(page: Page) {
    this.panel = page.locator('#code-samples')
  }

  testingTypeOption(value: TestingType): Locator {
    return this.panel.getByTestId(`testing-type-${value}`)
  }

  frameworkOption(value: Framework): Locator {
    return this.panel.getByTestId(`automation-framework-${value}`)
  }

  fileTab(filename: string): Locator {
    return this.panel.getByTestId(`file-tab-${filename}`)
  }

  // Every file panel is force-mounted at once (see CodeFileTabs.tsx), so
  // this testid is only ever applied to whichever one is currently active —
  // it's the one stable way to grab "the visible code" without also
  // matching hidden panels for other files.
  get activeCodePanel(): Locator {
    return this.panel.getByTestId('active-code-panel')
  }

  get activeFilePath(): Locator {
    return this.panel.getByTestId('active-file-path')
  }

  async selectTestingType(value: TestingType) {
    await this.testingTypeOption(value).click()
  }

  async selectFramework(value: Framework) {
    await this.frameworkOption(value).click()
  }

  async selectFile(filename: string) {
    await this.fileTab(filename).click()
  }
}
