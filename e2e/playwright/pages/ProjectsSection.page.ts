import type { Locator, Page } from '@playwright/test'

export type StageId = 'pipeline' | 'static' | 'unit' | 'component' | 'e2e'
export type Framework = 'playwright' | 'cypress' | 'postman'

// The Projects section: two numbered projects, each a row that opens in
// place. This site's own testing (its CI pipeline, which is also how its
// code is browsed) starts open; the separate API suite starts closed.
export class ProjectsSection {
  readonly section: Locator
  readonly siteProject: Locator
  readonly apiProject: Locator
  // The site's code panel. Every file panel is force-mounted at once (see
  // CodeFileTabs.tsx), so only the testid'd one is unambiguous; scoped to
  // the site project, since the API suite has a panel of its own.
  readonly activeCodePanel: Locator
  readonly activeFilePath: Locator
  readonly activeFileNote: Locator

  constructor(page: Page) {
    this.section = page.locator('#projects')
    this.siteProject = this.section.getByTestId('project-site')
    this.apiProject = this.section.getByTestId('project-api')
    this.activeCodePanel = this.siteProject.getByTestId('active-code-panel')
    this.activeFilePath = this.siteProject.getByTestId('active-file-path')
    this.activeFileNote = this.siteProject.getByTestId('active-file-note')
  }

  /** An entry in the index beside the title (01, 02), which jumps to it. */
  indexLink(name: RegExp): Locator {
    return this.section.getByRole('list', { name: 'Projects in this section' }).getByRole('link', { name })
  }

  /** One of the pipeline's nodes (ci.yml, or a stage): a radio that shows its code. */
  stage(id: StageId): Locator {
    return this.siteProject.getByTestId(`pipeline-stage-${id}`)
  }

  // Only the end-to-end stage has two frameworks to switch between. By
  // testid: its accessible name ('Playwright') is also part of the stage
  // card's longer name, so a role query would match both.
  frameworkOption(name: Framework): Locator {
    return this.siteProject.getByTestId(`end-to-end-framework-${name}`)
  }

  fileTab(name: string): Locator {
    return this.siteProject.getByRole('tab', { name })
  }

  get siteToggle(): Locator {
    return this.siteProject.getByRole('button', { name: /^Open:/ })
  }

  get apiToggle(): Locator {
    return this.apiProject.getByRole('button', { name: /^Open:/ })
  }

  apiToolOption(name: Framework): Locator {
    return this.apiProject.getByTestId(`api-tool-${name}`)
  }

  get apiActiveCodePanel(): Locator {
    return this.apiProject.getByTestId('active-code-panel')
  }

  async selectStage(id: StageId) {
    await this.stage(id).click()
  }

  async selectFramework(name: Framework) {
    await this.frameworkOption(name).click()
  }

  async selectFile(name: string) {
    await this.fileTab(name).click()
  }
}
