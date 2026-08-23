import { SiCypress } from 'react-icons/si'
import type { SegmentedControlOption } from '../SegmentedControl/SegmentedControl'
import type { Framework, TestingType } from '../../../content/codeExamples'

export type SelectableTestingType = Exclude<TestingType, 'performance'>

// react-icons' bundled Simple Icons set has no Playwright mark (checked
// against the installed version) — Cypress gets its real logo, Playwright
// stays text-only rather than fake a brand icon.
//
// Playwright CT has no matching example in codeExamples.ts yet, so it's
// disabled/soon rather than faked — same honesty rule as the testing-type
// tier's Performance option.
export const frameworkOptionsByTestingType: Record<
  SelectableTestingType,
  SegmentedControlOption<Framework>[]
> = {
  e2e: [
    { value: 'playwright', label: 'Playwright' },
    { value: 'cypress', label: 'Cypress', icon: <SiCypress aria-hidden="true" /> },
  ],
  component: [
    { value: 'cypress-ct', label: 'Cypress CT', icon: <SiCypress aria-hidden="true" /> },
    { value: 'playwright-ct', label: 'Playwright CT', disabled: true },
  ],
}
