// The Projects section's code panel. Every file here is imported from the
// real file it names (`?highlight`: its text plus that text highlighted, both
// made at build time; see scripts/highlight-plugin.ts), so the panel shows
// exactly what runs: it can't drift from the suite the way hand-copied code
// did.
import { apiTestingExamples } from './apiTesting'
import { links } from './links'

import playwrightSpec from '../../e2e/playwright/case-studies.spec.ts?highlight'
import playwrightPage from '../../e2e/playwright/pages/CaseStudiesSection.page.ts?highlight'
import playwrightFixtures from '../../e2e/playwright/fixtures.ts?highlight'
import playwrightConfig from '../../playwright.config.ts?highlight'
import cypressSpec from '../../e2e/cypress/case-studies.cy.ts?highlight'
import cypressPage from '../../e2e/cypress/pages/CaseStudiesSection.page.ts?highlight'
import cypressPortfolioPage from '../../e2e/cypress/pages/PortfolioPage.page.ts?highlight'
import cypressConfig from '../../cypress.config.ts?highlight'
import copyButtonTest from '../components/atoms/CopyButton/CopyButton.test.tsx?highlight'
import segmentedControlTest from '../components/molecules/SegmentedControl/SegmentedControl.test.tsx?highlight'
import vitestSetup from '../test/setup.ts?highlight'
import copyButtonCy from '../components/atoms/CopyButton/CopyButton.cy.tsx?highlight'
import segmentedControlCy from '../components/molecules/SegmentedControl/SegmentedControl.cy.tsx?highlight'
import cypressComponentSupport from '../../cypress/support/component.ts?highlight'
import eslintConfig from '../../eslint.config.js?highlight'
import ciWorkflow from '../../.github/workflows/ci.yml?highlight'
import lintAndBuildWorkflow from '../../.github/workflows/lint-and-build.yml?highlight'
import unitWorkflow from '../../.github/workflows/unit-tests.yml?highlight'
import componentWorkflow from '../../.github/workflows/component-tests.yml?highlight'
import e2eWorkflow from '../../.github/workflows/e2e-tests.yml?highlight'

export type TestingType = 'pipeline' | 'static' | 'e2e' | 'component' | 'api'

export type Framework = 'github-actions' | 'playwright' | 'cypress' | 'vitest' | 'postman'

export type CodeLanguage = 'typescript' | 'javascript' | 'yaml'

export type CodeFile = {
  /** The file's path, shown under the panel. */
  filename: string
  /** The file's tab, when its name alone wouldn't tell tabs apart. */
  label?: string
  /** A line of context above the code, when the file needs one. */
  note?: string
  language: CodeLanguage
  code: string
  /** The code, highlighted at build time. */
  html: string
}

export type AutomationExample = {
  id: string
  testingType: TestingType
  framework: Framework
  files: CodeFile[]
}

// A file imported with ?highlight: its text and that text highlighted.
type Highlighted = { code: string; html: string }

const typescript = (filename: string, file: Highlighted): CodeFile => ({
  filename,
  language: 'typescript',
  ...file,
})

const javascript = (filename: string, file: Highlighted): CodeFile => ({
  filename,
  language: 'javascript',
  ...file,
})

// The CI workflow that runs an example, shown as its last file: the hard
// evidence of how (and when) its tests are executed.
const workflow = (file: string, highlighted: Highlighted): CodeFile => ({
  filename: `.github/workflows/${file}`,
  language: 'yaml',
  ...highlighted,
})

// The API examples live in their own repo (fetched at build time; see
// apiTesting.ts), and both pairs come from the same two files, so each tab
// is named for its case instead: the part of its title after the colon.
const apiRepo = links.apiTestingRepo.split('/').pop()
const apiFiles = (tool: 'playwright' | 'postman'): CodeFile[] =>
  apiTestingExamples.map((example) => ({
    filename: `${apiRepo}/${example[tool].filename}`,
    label: example.title.split(': ').pop(),
    note: example.description,
    language: example[tool].language,
    code: example[tool].code,
    html: example[tool].html,
  }))

export const codeExamples: readonly AutomationExample[] = [
  // The CI pipeline itself, which every example below runs in: ci.yml calls
  // one workflow per stage, in tiers.
  {
    id: 'ci-pipeline',
    testingType: 'pipeline',
    framework: 'github-actions',
    files: [workflow('ci.yml', ciWorkflow)],
  },
  // The first tier has no tests of its own: the rules its lint step holds
  // the code to, then the workflow that runs it (with the type check and
  // build).
  {
    id: 'static-checks',
    testingType: 'static',
    framework: 'github-actions',
    files: [javascript('eslint.config.js', eslintConfig), workflow('lint-and-build.yml', lintAndBuildWorkflow)],
  },
  // Ordered spec -> page object -> config: that's the mental flow of writing
  // the suite - start from the scenario/assertions, follow a locator into the
  // page object that models it, then the fixture wiring and runner config
  // that make the spec runnable at all.
  {
    id: 'playwright-case-studies',
    testingType: 'e2e',
    framework: 'playwright',
    files: [
      typescript('e2e/playwright/case-studies.spec.ts', playwrightSpec),
      typescript('e2e/playwright/pages/CaseStudiesSection.page.ts', playwrightPage),
      typescript('e2e/playwright/fixtures.ts', playwrightFixtures),
      typescript('playwright.config.ts', playwrightConfig),
      workflow('e2e-tests.yml', e2eWorkflow),
    ],
  },
  // Same spec -> page object -> config flow as the Playwright example above
  // (and the same underlying scenario, so switching frameworks mid-read is
  // apples-to-apples) - including the real difference between them: Cypress
  // has no fixture-injection story, so PortfolioPage is instantiated
  // directly in the spec instead of handed in by a fixture.
  {
    id: 'cypress-case-studies',
    testingType: 'e2e',
    framework: 'cypress',
    files: [
      typescript('e2e/cypress/case-studies.cy.ts', cypressSpec),
      typescript('e2e/cypress/pages/CaseStudiesSection.page.ts', cypressPage),
      typescript('e2e/cypress/pages/PortfolioPage.page.ts', cypressPortfolioPage),
      typescript('cypress.config.ts', cypressConfig),
      workflow('e2e-tests.yml', e2eWorkflow),
    ],
  },
  // Vitest + React Testing Library runs these against jsdom; the Cypress CT
  // example right after this one runs the same two components through the
  // same assertions in a real browser instead. CopyButton covers
  // interaction/mocked-clipboard/fake timers; SegmentedControl covers the
  // accessibility semantics (ARIA role, disabled state); setup.ts is the
  // shared jsdom config both rely on - Component's answer to the config file
  // that closes out each e2e example above.
  {
    id: 'vitest-component-tests',
    testingType: 'component',
    framework: 'vitest',
    files: [
      typescript('src/components/atoms/CopyButton/CopyButton.test.tsx', copyButtonTest),
      typescript('src/components/molecules/SegmentedControl/SegmentedControl.test.tsx', segmentedControlTest),
      typescript('src/test/setup.ts', vitestSetup),
      workflow('unit-tests.yml', unitWorkflow),
    ],
  },
  // Same two components, same three behaviors each, as the Vitest example
  // above - deliberately redundant coverage, mounted through Cypress's real
  // Chrome instead of jsdom. It exists so the Component tier can offer a
  // genuine framework choice the same way the E2E tier does, not because
  // jsdom was ever insufficient. component.ts is the CT equivalent of
  // setup.ts: shared support/config Cypress loads before every spec (custom
  // `cy.mount`, global CSS).
  {
    id: 'cypress-ct-component-tests',
    testingType: 'component',
    framework: 'cypress',
    files: [
      typescript('src/components/atoms/CopyButton/CopyButton.cy.tsx', copyButtonCy),
      typescript('src/components/molecules/SegmentedControl/SegmentedControl.cy.tsx', segmentedControlCy),
      typescript('cypress/support/component.ts', cypressComponentSupport),
      workflow('component-tests.yml', componentWorkflow),
    ],
  },
  // The API suite runs each case two ways: explored by hand in Postman
  // first, then automated with Playwright's request fixture for CI.
  {
    id: 'playwright-api',
    testingType: 'api',
    framework: 'playwright',
    files: apiFiles('playwright'),
  },
  {
    id: 'postman-api',
    testingType: 'api',
    framework: 'postman',
    files: apiFiles('postman'),
  },
]
