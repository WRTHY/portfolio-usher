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
  readonly nav = new NavComponent()
  readonly themeToggle = new ThemeToggleComponent()
  readonly caseStudies = new CaseStudiesSection()
  readonly codeSamples = new CodeSamplesSection()

  visit() {
    cy.visit('/')
  }

  section(id: SectionId): Cypress.Chainable<JQuery> {
    return cy.get(`#${id}`)
  }
}
