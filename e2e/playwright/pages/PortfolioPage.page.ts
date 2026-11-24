import type { Locator, Page } from '@playwright/test'
import { NavComponent } from './NavComponent.page'
import type { SectionId } from './NavComponent.page'
import { ThemeToggleComponent } from './ThemeToggleComponent.page'
import { CaseStudiesSection } from './CaseStudiesSection.page'
import { ProjectsSection } from './ProjectsSection.page'
import { HeroSection } from './HeroSection.page'
import { ExperienceSection } from './ExperienceSection.page'

export type { SectionId }

// Composition root for the site. It's a single page with no real per-URL
// navigation, so rather than one class per route this models one root
// object owning a component per section/region - the same shape the app
// itself uses (Header/Hero/About/Experience/CaseStudies/Projects as siblings).
export class PortfolioPage {
  readonly page: Page
  readonly hero: HeroSection
  readonly experience: ExperienceSection
  readonly nav: NavComponent
  readonly themeToggle: ThemeToggleComponent
  readonly caseStudies: CaseStudiesSection
  readonly projects: ProjectsSection

  constructor(page: Page) {
    this.page = page
    this.hero = new HeroSection(page)
    this.experience = new ExperienceSection(page)
    this.nav = new NavComponent(page)
    this.themeToggle = new ThemeToggleComponent(page)
    this.caseStudies = new CaseStudiesSection(page)
    this.projects = new ProjectsSection(page)
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

  /** The desktop left rail: section dots, theme toggle, socials. */
  get rail(): Locator {
    return this.page.getByRole('complementary', { name: 'Quick links' })
  }

  /** Parts of the rail showing the violet section's colours right now. */
  get railPartsOnAccent(): Locator {
    return this.rail.locator('[data-on-accent]')
  }

  /** Scrolls so the section's top sits just under the sticky top bar. */
  async scrollSectionToTop(id: SectionId) {
    await this.section(id).evaluate((section) =>
      window.scrollTo({ top: section.getBoundingClientRect().top + window.scrollY - 80, behavior: 'instant' }),
    )
  }
}
