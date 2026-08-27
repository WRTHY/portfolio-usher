export type TestingType = 'e2e' | 'component' | 'performance'
// Only e2e has a real SegmentedControl to select a framework from — Component
// renders its single framework as a static note (see CodeSamples.tsx), so
// there's no 'vitest' testid for frameworkOption() to look up.
export type Framework = 'playwright' | 'cypress'

export class CodeSamplesSection {
  get panel(): Cypress.Chainable<JQuery> {
    return cy.get('#code-samples')
  }

  // The active file's panel/path (see CodeFileTabs.tsx and PanelFooter.tsx)
  // — every file panel is force-mounted simultaneously, so only the
  // testid'd one is unambiguous; there's no equivalent role-based query.
  get activeCodePanel(): Cypress.Chainable<JQuery> {
    return this.panel.findByTestId('active-code-panel')
  }

  get activeFilePath(): Cypress.Chainable<JQuery> {
    return this.panel.findByTestId('active-file-path')
  }

  // Framework/language pickers are a RadioGroup (role="radio"), not Tabs —
  // they select a value rather than owning a tabpanel of their own. Only
  // the file picker below is genuine Tabs, since it actually swaps panels.
  // testid rather than role+name: Framework's values ('playwright'/'cypress')
  // are lowercase, but the rendered label is capitalized ('Playwright'/
  // 'Cypress') — findByRole's exact, case-sensitive name match would never
  // find it.
  frameworkOption(name: Framework): Cypress.Chainable<JQuery> {
    return this.panel.findByTestId(`automation-framework-${name}`)
  }

  // Accepts a RegExp for Python/Java: their accessible name is the
  // language plus a concatenated "soon" badge (e.g. "Pythonsoon").
  languageOption(name: string | RegExp): Cypress.Chainable<JQuery> {
    return this.panel.findByRole('radio', { name })
  }

  // Same "soon" concatenation as languageOption above, for the Performance
  // testing type — see SegmentedControl.tsx's `${testIdPrefix}-${value}`.
  testingTypeOption(name: TestingType): Cypress.Chainable<JQuery> {
    return this.panel.findByTestId(`testing-type-${name}`)
  }

  fileTab(filename: string): Cypress.Chainable<JQuery> {
    return this.panel.findByRole('tab', { name: filename })
  }

  // Syntax highlighting splits each line into many per-token <span>s, so
  // the target substring is rarely any single element's own text.
  // testing-library's findByText only matches an element's direct text
  // nodes (not descendant text), so it can't see across those tokens —
  // cy.contains() matches on full rendered text like Playwright's
  // getByText does, which is what's needed here.
  codeContaining(text: string): Cypress.Chainable<JQuery> {
    return this.panel.contains(text)
  }

  selectFramework(name: Framework) {
    this.frameworkOption(name).click()
  }

  selectFile(filename: string) {
    this.fileTab(filename).click()
  }
}
