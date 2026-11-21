import type { Locator, Page } from '@playwright/test'
import { NavComponent } from './NavComponent.page'
import type { SectionId } from './NavComponent.page'
import { ThemeToggleComponent } from './ThemeToggleComponent.page'
import { CaseStudiesSection } from './CaseStudiesSection.page'
import { CodeSamplesSection } from './CodeSamplesSection.page'
import { HeroSection } from './HeroSection.page'

export type { SectionId }

// Composition root for the site. It's a single page with no real per-URL
// navigation, so rather than one class per route this models one root
// object owning a component per section/region - the same shape the app
// itself uses (Header/Hero/About/Experience/CaseStudies/CodeSamples as siblings).
export class PortfolioPage {
  readonly page: Page
  readonly hero: HeroSection
  readonly nav: NavComponent
  readonly themeToggle: ThemeToggleComponent
  readonly caseStudies: CaseStudiesSection
  readonly codeSamples: CodeSamplesSection

  constructor(page: Page) {
    this.page = page
    this.hero = new HeroSection(page)
    this.nav = new NavComponent(page)
    this.themeToggle = new ThemeToggleComponent(page)
    this.caseStudies = new CaseStudiesSection(page)
    this.codeSamples = new CodeSamplesSection(page)
  }

  // The opener plays on the first visit of each browser session and would
  // cover the page for its first few seconds, so by default this marks it as
  // already seen. Specs about the opener itself pass { intro: true }.
  async goto({ intro = false }: { intro?: boolean } = {}) {
    if (!intro) {
      await this.page.addInitScript(() => window.sessionStorage.setItem('ju-intro-seen', '1'))
    }
    await this.page.goto('/')
  }

  section(id: SectionId): Locator {
    return this.page.locator(`#${id}`)
  }
}
