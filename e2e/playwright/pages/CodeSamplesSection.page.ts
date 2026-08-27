import type { Locator, Page } from '@playwright/test'

export type TestingType = 'e2e' | 'component' | 'performance'
// Only e2e has a real SegmentedControl to select a framework from — Component
// renders its single framework as a static note (see CodeSamples.tsx), so
// there's no 'vitest' testid for frameworkOption() to look up.
export type Framework = 'playwright' | 'cypress'

export class CodeSamplesSection {
  readonly panel: Locator
  // The active file's panel/path (see CodeFileTabs.tsx and PanelFooter.tsx)
  // — every file panel is force-mounted simultaneously, so only the
  // testid'd one is unambiguous; there's no equivalent role-based query.
  readonly activeCodePanel: Locator
  readonly activeFilePath: Locator

  constructor(page: Page) {
    this.panel = page.locator('#code-samples')
    this.activeCodePanel = this.panel.getByTestId('active-code-panel')
    this.activeFilePath = this.panel.getByTestId('active-file-path')
  }

  // Framework/language pickers are a RadioGroup (role="radio"), not Tabs —
  // they select a value rather than owning a tabpanel of their own. Only
  // the file picker below is genuine Tabs, since it actually swaps panels.
  // testid rather than role+name: Framework's values ('playwright'/'cypress')
  // are lowercase, but the rendered label is capitalized ('Playwright'/
  // 'Cypress') — an exact accessible-name match would never find it.
  frameworkOption(name: Framework): Locator {
    return this.panel.getByTestId(`automation-framework-${name}`)
  }

  // Accepts a RegExp for Python/Java: their accessible name is the
  // language plus a concatenated "soon" badge (e.g. "Pythonsoon").
  languageOption(name: string | RegExp): Locator {
    return this.panel.getByRole('radio', { name })
  }

  // Same "soon" concatenation as languageOption above, for the Performance
  // testing type — see SegmentedControl.tsx's `${testIdPrefix}-${value}`.
  testingTypeOption(name: TestingType): Locator {
    return this.panel.getByTestId(`testing-type-${name}`)
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
