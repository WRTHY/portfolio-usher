import { NavComponent } from './NavComponent.page'
import type { SectionId } from './NavComponent.page'
import { ThemeToggleComponent } from './ThemeToggleComponent.page'
import { CaseStudiesSection } from './CaseStudiesSection.page'
import { ProjectsSection } from './ProjectsSection.page'
import { HeroSection } from './HeroSection.page'
import { ExperienceSection } from './ExperienceSection.page'
import { ContactSection } from './ContactSection.page'

export type { SectionId }

// One page, so one root object with a component per section
export class PortfolioPage {
  readonly hero = new HeroSection()
  readonly experience = new ExperienceSection()
  readonly nav = new NavComponent()
  readonly themeToggle = new ThemeToggleComponent()
  readonly caseStudies = new CaseStudiesSection()
  readonly projects = new ProjectsSection()
  readonly contact = new ContactSection()

  // Skips the first-visit intro unless a spec asks for it.
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

  get rail(): Cypress.Chainable<JQuery> {
    return cy.findByRole('complementary', { name: 'Quick links' })
  }

  get railPartsOnAccent(): Cypress.Chainable<JQuery> {
    return this.rail.find('[data-on-accent]')
  }

  scrollSectionToTop(id: SectionId) {
    this.section(id).then(($section) => {
      cy.window().then((win) => {
        const top = $section[0].getBoundingClientRect().top + win.scrollY - 80
        win.scrollTo({ top, behavior: 'instant' })
      })
    })
  }
}
