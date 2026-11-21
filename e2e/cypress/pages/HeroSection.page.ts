// The hero: name, pitch, actions, the docked test run, and the Pick locator
// switch that turns on the locator inspector. Also owns the one-time opener,
// since it's the hero's entrance.
export class HeroSection {
  get name(): Cypress.Chainable<JQuery> {
    return cy.findByRole('heading', { level: 1 })
  }

  get pickSwitch(): Cypress.Chainable<JQuery> {
    return cy.findByRole('switch', { name: 'Pick locator' })
  }

  // cy.get, not findBy*: specs assert both its presence and its absence.
  get locatorTip(): Cypress.Chainable<JQuery> {
    return cy.get('[data-testid="locator-tip"]')
  }

  // The top bar's copy of the name, which only shows once the hero name has
  // scrolled away. A plain selector, so specs can assert both states.
  get barName(): Cypress.Chainable<JQuery> {
    return cy.get('header a[href="#top"]')
  }

  get opener(): Cypress.Chainable<JQuery> {
    return cy.get('[data-testid="opener"]')
  }

  startPicking() {
    this.pickSwitch.click()
  }
}
