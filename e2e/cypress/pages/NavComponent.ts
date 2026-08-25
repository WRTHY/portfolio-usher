export type SectionId = 'about' | 'experience' | 'case-studies' | 'code-samples'

// The app renders two separate nav UIs that are never both visible at once
// (Header.module.css / InfoPanel.module.css split display:none on opposite
// sides of the 640px breakpoint): a hamburger menu for mobile, and the
// sidebar "Sections" list for desktop. A role query naturally picked
// whichever one the accessibility tree currently exposed, but a testid
// query has no such filtering — so each gets its own testid rather than
// sharing one, and callers pick the variant that matches their viewport.
export class NavComponent {
  link(sectionId: SectionId): Cypress.Chainable<JQuery> {
    return cy.findByTestId(`nav-link-desktop-${sectionId}`)
  }

  goTo(sectionId: SectionId) {
    this.link(sectionId).click()
  }

  mobileLink(sectionId: SectionId): Cypress.Chainable<JQuery> {
    return cy.findByTestId(`nav-link-mobile-${sectionId}`)
  }

  mobileGoTo(sectionId: SectionId) {
    this.mobileLink(sectionId).click()
  }

  get menuToggle(): Cypress.Chainable<JQuery> {
    return cy.findByTestId('menu-toggle')
  }

  openMenu() {
    this.menuToggle.click()
  }

  closeMenu() {
    this.menuToggle.click()
  }
}
