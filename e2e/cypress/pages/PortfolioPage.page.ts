import { NavComponent } from './NavComponent.page'
import type { SectionId } from './NavComponent.page'
import { ThemeToggleComponent } from './ThemeToggleComponent.page'
import { CaseStudiesSection } from './CaseStudiesSection.page'
import { CodeSamplesSection } from './CodeSamplesSection.page'
import { HeroSection } from './HeroSection.page'
import { ExperienceSection } from './ExperienceSection.page'

export type { SectionId }

// Composition root for the site. It's a single page with no real per-URL
// navigation, so rather than one class per route this models one root
// object owning a component per section/region - the same shape the app
// itself uses (Header/Hero/About/Experience/CaseStudies/CodeSamples as siblings).
export class PortfolioPage {
  readonly hero = new HeroSection()
  readonly experience = new ExperienceSection()
  readonly nav = new NavComponent()
  readonly themeToggle = new ThemeToggleComponent()
  readonly caseStudies = new CaseStudiesSection()
  readonly codeSamples = new CodeSamplesSection()

  // The opener plays on the first visit of each browser session and would
  // cover the page for its first few seconds, so by default this marks it as
  // already seen. Specs about the opener itself pass { intro: true }.
  visit({ intro = false }: { intro?: boolean } = {}) {
    cy.visit('/', {
      onBeforeLoad(win) {
        if (!intro) win.sessionStorage.setItem('ju-intro-seen', '1')
      },
    })
  }

  section(id: SectionId): Cypress.Chainable<JQuery> {
    return cy.get(`#${id}`)
  }
}
