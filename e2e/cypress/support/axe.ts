import type { Result } from 'axe-core'

// axe ships plenty of "best practice" rules beyond WCAG itself; scoping to
// these tags keeps the suite asserting actual conformance criteria rather
// than opinion — WCAG 2.1 AA is the level most orgs target for compliance
// (it's what ADA/Section 508 audits typically cite).
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

// cypress-axe's cy.checkA11y fails the test itself as soon as it finds a
// violation, which would short-circuit before a spec gets to assert
// anything — so violations are captured (skipFailures: true) and handed
// back as a value, letting each spec assert on them the same way the
// Playwright suite does with scanForViolations().
export function scanForViolations(): Cypress.Chainable<Result[]> {
  cy.injectAxe()

  let violations: Result[] = []
  cy.checkA11y(
    undefined,
    { runOnly: { type: 'tag', values: WCAG_TAGS } },
    (results) => {
      violations = results
    },
    true,
  )

  return cy.then(() => violations)
}

// axe's raw violation objects are deep and noisy in CI output — this trims
// each one down to what you'd actually act on: which rule, how severe, and
// which elements on the page triggered it.
export function formatViolations(violations: Result[]): string {
  return violations
    .map((violation) => {
      const targets = violation.nodes.map((node) => node.target.join(' ')).join(', ')
      return `[${violation.impact}] ${violation.id}: ${violation.help}\n  → ${targets}\n  ${violation.helpUrl}`
    })
    .join('\n\n')
}
