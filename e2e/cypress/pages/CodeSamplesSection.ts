export type TestingType = 'e2e' | 'component' | 'performance'
export type Framework = 'playwright' | 'cypress' | 'playwright-ct' | 'cypress-ct'

export class CodeSamplesSection {
  get panel(): Cypress.Chainable<JQuery> {
    return cy.get('#code-samples')
  }

  testingTypeOption(value: TestingType): Cypress.Chainable<JQuery> {
    return this.panel.findByTestId(`testing-type-${value}`)
  }

  frameworkOption(value: Framework): Cypress.Chainable<JQuery> {
    return this.panel.findByTestId(`automation-framework-${value}`)
  }

  fileTab(filename: string): Cypress.Chainable<JQuery> {
    return this.panel.findByTestId(`file-tab-${filename}`)
  }

  // Every file panel is force-mounted at once (see CodeFileTabs.tsx), so
  // this testid is only ever applied to whichever one is currently active —
  // it's the one stable way to grab "the visible code" without also
  // matching hidden panels for other files.
  get activeCodePanel(): Cypress.Chainable<JQuery> {
    return this.panel.findByTestId('active-code-panel')
  }

  get activeFilePath(): Cypress.Chainable<JQuery> {
    return this.panel.findByTestId('active-file-path')
  }

  selectTestingType(value: TestingType) {
    this.testingTypeOption(value).click()
  }

  selectFramework(value: Framework) {
    this.frameworkOption(value).click()
  }

  selectFile(filename: string) {
    this.fileTab(filename).click()
  }
}
