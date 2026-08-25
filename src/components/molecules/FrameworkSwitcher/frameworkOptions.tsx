import { SiCypress } from 'react-icons/si'
import type { SegmentedControlOption } from '../SegmentedControl/SegmentedControl'
import type { Framework, TestingType } from '../../../content/codeExamples'

export type SelectableTestingType = Exclude<TestingType, 'performance'>

// react-icons' bundled Simple Icons set has no Playwright mark (checked
// against the installed version) — Cypress gets its real logo, Playwright
// stays text-only rather than fake a brand icon.
//
// Component testing has two real frameworks in this repo, same as e2e:
// Vitest + React Testing Library (jsdom) and Cypress component testing
// (real-browser mount). Both run the same assertions against the same
// components — see the sibling *.cy.tsx/*.test.tsx pairs under src/ — so
// switching frameworks here is an honest choice, not a fake one. Playwright
// has no component-test runner configured in this repo, so it isn't listed.
export const frameworkOptionsByTestingType: Record<
  SelectableTestingType,
  SegmentedControlOption<Framework>[]
> = {
  e2e: [
    { value: 'playwright', label: 'Playwright' },
    { value: 'cypress', label: 'Cypress', icon: <SiCypress aria-hidden="true" /> },
  ],
  component: [
    { value: 'vitest', label: 'Vitest + React Testing Library' },
    { value: 'cypress', label: 'Cypress CT', icon: <SiCypress aria-hidden="true" /> },
  ],
}
