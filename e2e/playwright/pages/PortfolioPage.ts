import type { Locator, Page } from '@playwright/test'
import { NavComponent } from './NavComponent'
import type { SectionId } from './NavComponent'
import { ThemeToggleComponent } from './ThemeToggleComponent'
import { CaseStudiesSection } from './CaseStudiesSection'
import { CodeSamplesSection } from './CodeSamplesSection'

export type { SectionId }

// Composition root for the site. It's a single page with no real per-URL
// navigation, so rather than one class per route this models one root
// object owning a component per section/region — the same shape the app
// itself uses (Header/Sidebar/CaseStudies/CodeSamples as siblings).
export class PortfolioPage {
  readonly page: Page
  readonly nav: NavComponent
  readonly themeToggle: ThemeToggleComponent
  readonly caseStudies: CaseStudiesSection
  readonly codeSamples: CodeSamplesSection

  constructor(page: Page) {
    this.page = page
    this.nav = new NavComponent(page)
    this.themeToggle = new ThemeToggleComponent(page)
    this.caseStudies = new CaseStudiesSection(page)
    this.codeSamples = new CodeSamplesSection(page)
  }

  async goto() {
    await this.page.goto('/')
  }

  section(id: SectionId): Locator {
    return this.page.locator(`#${id}`)
  }
}
