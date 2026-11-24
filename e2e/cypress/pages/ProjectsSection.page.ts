export type StageId = 'pipeline' | 'static' | 'unit' | 'component' | 'e2e'
export type Framework = 'playwright' | 'cypress' | 'postman'

// The Projects section: two numbered projects, each a row that opens in
// place. This site's own testing (its CI pipeline, which is also how its
// code is browsed) starts open; the separate API suite starts closed.
export class ProjectsSection {
  get section(): Cypress.Chainable<JQuery> {
    return cy.get('#projects')
  }

  get siteProject(): Cypress.Chainable<JQuery> {
    return cy.findByTestId('project-site')
  }

  get apiProject(): Cypress.Chainable<JQuery> {
    return cy.findByTestId('project-api')
  }

  // The site's code panel. Every file panel is force-mounted at once (see
  // CodeFileTabs.tsx), so only the testid'd one is unambiguous; scoped to
  // the site project, since the API suite has a panel of its own.
  get activeCodePanel(): Cypress.Chainable<JQuery> {
    return this.siteProject.findByTestId('active-code-panel')
  }

  get activeFilePath(): Cypress.Chainable<JQuery> {
    return this.siteProject.findByTestId('active-file-path')
  }

  get activeFileNote(): Cypress.Chainable<JQuery> {
    return this.siteProject.findByTestId('active-file-note')
  }

  /** An entry in the index beside the title (01, 02), which jumps to it. */
  indexLink(name: RegExp): Cypress.Chainable<JQuery> {
    return this.section.findByRole('list', { name: 'Projects in this section' }).findByRole('link', { name })
  }

  /** One of the pipeline's nodes (ci.yml, or a stage): a radio that shows its code. */
  stage(id: StageId): Cypress.Chainable<JQuery> {
    return this.siteProject.findByTestId(`pipeline-stage-${id}`)
  }

  // Only the end-to-end stage has two frameworks to switch between. By
  // testid: its accessible name ('Playwright') is also part of the stage
  // card's longer name.
  frameworkOption(name: Framework): Cypress.Chainable<JQuery> {
    return this.siteProject.findByTestId(`end-to-end-framework-${name}`)
  }

  fileTab(name: string): Cypress.Chainable<JQuery> {
    return this.siteProject.findByRole('tab', { name })
  }

  get siteToggle(): Cypress.Chainable<JQuery> {
    return this.siteProject.findByRole('button', { name: /^Open:/ })
  }

  get apiToggle(): Cypress.Chainable<JQuery> {
    return this.apiProject.findByRole('button', { name: /^Open:/ })
  }

  apiToolOption(name: Framework): Cypress.Chainable<JQuery> {
    return this.apiProject.findByTestId(`api-tool-${name}`)
  }

  // A plain query, so specs can assert it while it's still hidden.
  get apiActiveCodePanel(): Cypress.Chainable<JQuery> {
    return cy.get('[data-testid="project-api"] [data-testid="active-code-panel"]')
  }

  selectStage(id: StageId) {
    this.stage(id).click()
  }

  selectFramework(name: Framework) {
    this.frameworkOption(name).click()
  }

  selectFile(name: string) {
    this.fileTab(name).click()
  }
}
