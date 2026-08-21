const NAV_LABELS = ['Experience', 'Case Studies', 'Automation Examples', 'About'] as const
export type NavLabel = (typeof NAV_LABELS)[number]

// Wraps the header <nav>. The sidebar's dot navigation exposes the same
// accessible names (aria-label per section) as these links, so every
// locator here is scoped to the <nav> landmark to stay unambiguous.
export class NavComponent {
  private get nav(): Cypress.Chainable<JQuery> {
    return cy.findByRole('navigation')
  }

  link(label: NavLabel): Cypress.Chainable<JQuery> {
    return this.nav.findByRole('link', { name: label })
  }

  // The mobile menu hides its list with display:none when closed, which
  // drops it from the accessibility tree — findByRole can't locate it
  // there, so visibility checks that span the open/closed toggle use this
  // text-based lookup instead, which finds the element regardless of its
  // current CSS visibility.
  linkElement(label: NavLabel): Cypress.Chainable<JQuery<HTMLAnchorElement>> {
    return this.nav.contains('a', label)
  }

  goTo(label: NavLabel) {
    this.link(label).click()
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
