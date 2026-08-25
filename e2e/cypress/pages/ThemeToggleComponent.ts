export class ThemeToggleComponent {
  get button(): Cypress.Chainable<JQuery> {
    return cy.findByTestId('theme-toggle')
  }

  toggle() {
    this.button.click()
  }

  // Returning a bare `null`/`undefined` from `.then()` tells Cypress to keep
  // the previous subject rather than replace it, so the extracted value is
  // re-wrapped explicitly to get a clean Chainable<string | null> back.
  currentMode(): Cypress.Chainable<string | null> {
    return cy.get('html').then(($html) => cy.wrap<string | null>($html.attr('data-mode') ?? null))
  }

  storedMode(): Cypress.Chainable<string | null> {
    return cy.window().then((win) => cy.wrap<string | null>(win.localStorage.getItem('mode')))
  }
}
