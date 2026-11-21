export type SectionId = 'about' | 'experience' | 'case-studies' | 'code-samples' | 'api-testing'

// Two navs render the same section ids: InfoPanel's left nav card (visible
// at >=1024px) and the top bar's hamburger menu (below 1024px). Both tag
// their links with matching data-testids (see InfoPanel.tsx / Nav.tsx) keyed
// by SectionId, so this looks those up directly rather than by accessible
// name - the ids callers pass in ('case-studies') don't match the rendered
// label text ('Case Studies').
export class NavComponent {
  link(id: SectionId): Cypress.Chainable<JQuery> {
    return cy.findByTestId(`nav-link-desktop-${id}`)
  }

  goTo(id: SectionId) {
    this.link(id).click()
  }

  // The mobile nav's links live inside a panel that's display:none when
  // closed, which drops them from the accessibility tree - findByTestId
  // queries the raw DOM instead, so visibility checks spanning the
  // open/closed toggle still find a real (if hidden) element.
  mobileLink(id: SectionId): Cypress.Chainable<JQuery> {
    return cy.findByTestId(`nav-link-mobile-${id}`)
  }

  mobileGoTo(id: SectionId) {
    this.mobileLink(id).click()
  }

  // The toggle's accessible name flips between "Open menu" and "Close
  // menu" depending on state, so it's exposed as one dynamic locator
  // rather than two static ones.
  get menuToggle(): Cypress.Chainable<JQuery> {
    return cy.findByRole('button', { name: /(open|close) menu/i })
  }

  openMenu() {
    cy.findByRole('button', { name: 'Open menu' }).click()
  }

  closeMenu() {
    cy.findByRole('button', { name: 'Close menu' }).click()
  }
}
