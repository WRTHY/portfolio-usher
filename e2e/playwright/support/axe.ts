import AxeBuilder from '@axe-core/playwright'
import type { Page } from '@playwright/test'
import type { Result } from 'axe-core'

// axe ships plenty of "best practice" rules beyond WCAG itself; scoping to
// these tags keeps the suite asserting actual conformance criteria rather
// than opinion — WCAG 2.1 AA is the level most orgs target for compliance
// (it's what ADA/Section 508 audits typically cite).
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']

export async function scanForViolations(page: Page): Promise<Result[]> {
  const results = await new AxeBuilder({ page })
    .withTags(WCAG_TAGS)
    .analyze()
  return results.violations
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
