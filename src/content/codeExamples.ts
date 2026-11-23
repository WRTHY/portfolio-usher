// Each file's `code` is copied verbatim from the real file it names (see the
// comment on each example below), so this panel never drifts into showing
// invented code.

export type TestingType = 'component' | 'e2e' | 'performance'

export type Framework = 'playwright' | 'cypress' | 'vitest'

export type CodeFile = {
  filename: string
  language: 'typescript'
  code: string
}

export type AutomationExample = {
  id: string
  testingType: TestingType
  framework: Framework
  files: CodeFile[]
}

export const codeExamples: readonly AutomationExample[] = [
  // e2e/playwright/case-studies.spec.ts, e2e/playwright/pages/CaseStudiesSection.page.ts,
  // e2e/playwright/fixtures.ts and playwright.config.ts, verbatim. Ordered
  // spec -> page object -> config: that's the mental flow of writing the
  // suite - start from the scenario/assertions, follow a locator into the
  // page object that models it, then the fixture wiring and runner config
  // that make the spec runnable at all.
  {
    id: 'playwright-case-studies',
    testingType: 'e2e',
    framework: 'playwright',
    files: [
      {
        filename: 'playwright/case-studies.spec.ts',
        language: 'typescript',
        code: `import { test, expect } from './fixtures'

const CASE_STUDY_ID = 'CS 2'
const CASE_STUDY_TITLE = \`Building E2E Test Automation From Zero for Eventric's Flagship Desktop App\`

test.describe('case studies', () => {
  test('a row leads with its outcome, and keeps the write-up closed', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage
    const row = caseStudies.row(CASE_STUDY_ID)

    await expect(row.getByRole('heading', { level: 3 })).toHaveText(CASE_STUDY_TITLE)
    await expect(row).toContainText('4 hrs → 10 min')
    await expect(caseStudies.toggle(CASE_STUDY_ID)).toHaveAttribute('aria-expanded', 'false')
    await expect(caseStudies.writeUp(CASE_STUDY_ID)).toBeHidden()
  })

  test('the "+" opens the write-up in place, and closes it again', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage

    await caseStudies.open(CASE_STUDY_ID)

    await expect(caseStudies.toggle(CASE_STUDY_ID)).toHaveAttribute('aria-expanded', 'true')
    const writeUp = caseStudies.writeUp(CASE_STUDY_ID)
    await expect(writeUp).toBeVisible()
    await expect(writeUp.getByRole('heading', { level: 4 })).toHaveText([
      'Problem',
      'Approach',
      'Outcome',
      'Future iterations',
    ])

    await caseStudies.toggle(CASE_STUDY_ID).click()
    await expect(writeUp).toBeHidden()
  })

  test('closing from the end of a write-up returns focus and the view to its row', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage

    await caseStudies.open(CASE_STUDY_ID)
    // The write-up is long enough that its end is well below the row's top.
    await caseStudies.closeFromEnd(CASE_STUDY_ID).click()

    await expect(caseStudies.writeUp(CASE_STUDY_ID)).toBeHidden()
    await expect(caseStudies.toggle(CASE_STUDY_ID)).toBeFocused()
    await expect(caseStudies.row(CASE_STUDY_ID)).toBeInViewport()
  })
})
`,
      },
      {
        filename: 'playwright/pages/CaseStudiesSection.page.ts',
        language: 'typescript',
        code: `import type { Locator, Page } from '@playwright/test'

// The Case Studies ledger: one outcome-led row per case study, each opening
// its write-up in place.
export class CaseStudiesSection {
  readonly section: Locator

  constructor(page: Page) {
    this.section = page.locator('#case-studies')
  }

  // Rows are looked up by case study id (e.g. 'CS 2') through their test id:
  // a row's visible text is its outcome, title and topics, none of which is
  // as stable a handle as the id callers pass in.
  row(id: string): Locator {
    return this.section.getByTestId(\`case-study-\${id}\`)
  }

  /** The row's "+": a disclosure button named for its case study. */
  toggle(id: string): Locator {
    return this.row(id).getByRole('button', { name: /^Read case study:/ })
  }

  /** The full write-up. Resolves while closed too, so specs can assert both. */
  writeUp(id: string): Locator {
    return this.section.getByTestId(\`case-study-write-up-\${id}\`)
  }

  /** The control at the end of an open write-up. */
  closeFromEnd(id: string): Locator {
    return this.writeUp(id).getByRole('button', { name: 'Close case study' })
  }

  async open(id: string) {
    await this.toggle(id).click()
  }
}
`,
      },
      {
        filename: 'playwright/fixtures.ts',
        language: 'typescript',
        code: `import { test as base, expect } from '@playwright/test'
import { PortfolioPage } from './pages/PortfolioPage.page'

type Fixtures = {
  portfolioPage: PortfolioPage
}

export const test = base.extend<Fixtures>({
  portfolioPage: async ({ page }, use) => {
    await use(new PortfolioPage(page))
  },
})

export { expect }
`,
      },
      {
        filename: 'playwright.config.ts',
        language: 'typescript',
        code: `import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  // Scoped to its own subfolder since e2e/ will end up holding sibling
  // implementations of the same test scenarios in other frameworks/languages
  // (Cypress, then Python, Java) alongside this one.
  testDir: './e2e/playwright',
  fullyParallel: true,
  reporter: 'html',
  // Retry only in CI, never locally - a spec that needs a retry to pass
  // locally should fail loudly, not get silently rerun. In CI this
  // absorbs the sandboxed-environment timing flakiness (see README/
  // cypress.config.ts for the Cypress side of the same issue) without
  // masking a genuinely broken spec, which would still fail all 3 tries.
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  // Firefox/WebKit are left out for now: Firefox's binary won't spawn in
  // this sandboxed dev environment. WebKit was held back by a focus bug in
  // the old case-study modal; the modal is gone, but WebKit hasn't been
  // re-verified against the suite since, so it isn't added back yet.
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
})
`,
      },
    ],
  },
  // e2e/cypress/case-studies.cy.ts, e2e/cypress/pages/CaseStudiesSection.page.ts,
  // e2e/cypress/pages/PortfolioPage.page.ts and cypress.config.ts, verbatim.
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
      {
        filename: 'cypress/case-studies.cy.ts',
        language: 'typescript',
        code: `import { PortfolioPage } from './pages/PortfolioPage.page'

const CASE_STUDY_ID = 'CS 2'
const CASE_STUDY_TITLE = \`Building E2E Test Automation From Zero for Eventric's Flagship Desktop App\`

describe('case studies', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('a row leads with its outcome, and keeps the write-up closed', () => {
    const { caseStudies } = portfolioPage

    caseStudies.row(CASE_STUDY_ID).findByRole('heading', { level: 3 }).should('have.text', CASE_STUDY_TITLE)
    caseStudies.row(CASE_STUDY_ID).should('contain.text', '4 hrs → 10 min')
    caseStudies.toggle(CASE_STUDY_ID).should('have.attr', 'aria-expanded', 'false')
    caseStudies.writeUp(CASE_STUDY_ID).should('not.be.visible')
  })

  it('the "+" opens the write-up in place, and closes it again', () => {
    const { caseStudies } = portfolioPage

    caseStudies.open(CASE_STUDY_ID)

    caseStudies.toggle(CASE_STUDY_ID).should('have.attr', 'aria-expanded', 'true')
    caseStudies.writeUp(CASE_STUDY_ID).should('be.visible')
    caseStudies
      .writeUp(CASE_STUDY_ID)
      .findAllByRole('heading', { level: 4 })
      .then((headings) => {
        expect([...headings].map((heading) => heading.textContent)).to.deep.equal([
          'Problem',
          'Approach',
          'Outcome',
          'Future iterations',
        ])
      })

    caseStudies.toggle(CASE_STUDY_ID).click()
    caseStudies.writeUp(CASE_STUDY_ID).should('not.be.visible')
  })

  it('closing from the end of a write-up returns focus and the view to its row', () => {
    const { caseStudies } = portfolioPage

    caseStudies.open(CASE_STUDY_ID)
    // The write-up is long enough that its end is well below the row's top.
    caseStudies.closeFromEnd(CASE_STUDY_ID).click()

    caseStudies.writeUp(CASE_STUDY_ID).should('not.be.visible')
    caseStudies.toggle(CASE_STUDY_ID).should('have.focus')
    // Back in view: the row's top is on screen again, not scrolled above it.
    caseStudies.row(CASE_STUDY_ID).should(($row) => {
      const { top } = $row[0].getBoundingClientRect()
      expect(top).to.be.within(0, Cypress.config('viewportHeight'))
    })
  })
})
`,
      },
      {
        filename: 'cypress/pages/CaseStudiesSection.page.ts',
        language: 'typescript',
        code: `// The Case Studies ledger: one outcome-led row per case study, each opening
// its write-up in place.
export class CaseStudiesSection {
  get section(): Cypress.Chainable<JQuery> {
    return cy.get('#case-studies')
  }

  // Rows are looked up by case study id (e.g. 'CS 2') through their test id:
  // a row's visible text is its outcome, title and topics, none of which is
  // as stable a handle as the id callers pass in.
  row(id: string): Cypress.Chainable<JQuery> {
    return cy.findByTestId(\`case-study-\${id}\`)
  }

  /** The row's "+": a disclosure button named for its case study. */
  toggle(id: string): Cypress.Chainable<JQuery> {
    return this.row(id).findByRole('button', { name: /^Read case study:/ })
  }

  /** The full write-up. A plain query, so specs can assert it closed too. */
  writeUp(id: string): Cypress.Chainable<JQuery> {
    return cy.get(\`[data-testid="case-study-write-up-\${id}"]\`)
  }

  /** The control at the end of an open write-up. */
  closeFromEnd(id: string): Cypress.Chainable<JQuery> {
    return this.writeUp(id).findByRole('button', { name: 'Close case study' })
  }

  open(id: string) {
    this.toggle(id).click()
  }
}
`,
      },
      {
        filename: 'cypress/pages/PortfolioPage.page.ts',
        language: 'typescript',
        code: `import { NavComponent } from './NavComponent.page'
import type { SectionId } from './NavComponent.page'
import { ThemeToggleComponent } from './ThemeToggleComponent.page'
import { CaseStudiesSection } from './CaseStudiesSection.page'
import { CodeSamplesSection } from './CodeSamplesSection.page'
import { HeroSection } from './HeroSection.page'
import { ExperienceSection } from './ExperienceSection.page'

export type { SectionId }

// Composition root for the site. It's a single page with no real per-URL
// navigation, so rather than one class per route this models one root
// object owning a component per section/region - the same shape the app
// itself uses (Header/Hero/About/Experience/CaseStudies/CodeSamples as siblings).
export class PortfolioPage {
  readonly hero = new HeroSection()
  readonly experience = new ExperienceSection()
  readonly nav = new NavComponent()
  readonly themeToggle = new ThemeToggleComponent()
  readonly caseStudies = new CaseStudiesSection()
  readonly codeSamples = new CodeSamplesSection()

  // The opener plays on the first visit of each browser session and would
  // cover the page for its first few seconds, so by default this marks it as
  // already seen. Specs about the opener itself pass { intro: true }.
  visit({ intro = false }: { intro?: boolean } = {}) {
    cy.visit('/', {
      onBeforeLoad(win) {
        if (!intro) win.sessionStorage.setItem('ju-intro-seen', '1')
      },
    })
  }

  section(id: SectionId): Cypress.Chainable<JQuery> {
    return cy.get(\`#\${id}\`)
  }
}
`,
      },
      {
        filename: 'cypress.config.ts',
        language: 'typescript',
        code: `import { defineConfig } from 'cypress'

export default defineConfig({
  // CI-only, matching playwright.config.ts's rationale: absorbs the
  // sandbox-specific Electron/GPU rendering flakiness already documented
  // in the README, without hiding a spec that's actually broken (that
  // still fails all 3 tries and shows up red). Local runs (openMode)
  // never retry, so a real failure is seen immediately while developing.
  retries: { runMode: 2, openMode: 0 },
  // Scoped to its own subfolder alongside e2e/playwright: e2e/ holds sibling
  // implementations of the same test scenarios in other frameworks/languages
  // (Cypress here, Python/Java later).
  e2e: {
    baseUrl: 'http://localhost:5173',
    specPattern: 'e2e/cypress/**/*.cy.ts',
    supportFile: 'e2e/cypress/support/e2e.ts',
    fixturesFolder: false,
    setupNodeEvents() {},
  },
  // Deliberately redundant with the Vitest + React Testing Library suite:
  // same components, same assertions, different runner. It exists so the
  // Component tier of the portfolio's "Automation Examples" panel can offer
  // a real framework choice (Vitest vs Cypress) the same way the E2E tier
  // does (Playwright vs Cypress), not because the coverage was missing.
  // Specs are co-located under src/ next to the components they mount,
  // matching the *.test.tsx convention, rather than living under e2e/ like
  // the E2E specs above.
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.tsx',
    supportFile: 'cypress/support/component.ts',
    indexHtmlFile: 'cypress/support/component-index.html',
    fixturesFolder: false,
  },
})
`,
      },
    ],
  },
  // src/components/atoms/CopyButton/CopyButton.test.tsx,
  // src/components/molecules/SegmentedControl/SegmentedControl.test.tsx and
  // src/test/setup.ts, verbatim. Vitest + React Testing Library runs these
  // against jsdom; the Cypress CT example right after this one runs the
  // same two components through the same assertions in a real browser
  // instead - see that example's comment for how they compare. CopyButton
  // covers interaction/mocked-clipboard/fake timers; SegmentedControl
  // covers the accessibility semantics (ARIA role, disabled state); setup.ts
  // is the shared jsdom config both rely on - Component's answer to the
  // config file that closes out each e2e example above.
  {
    id: 'vitest-component-tests',
    testingType: 'component',
    framework: 'vitest',
    files: [
      {
        filename: 'src/components/atoms/CopyButton/CopyButton.test.tsx',
        language: 'typescript',
        code: `import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import CopyButton from './CopyButton'

// Featured verbatim as the Component/Vitest example in codeExamples.ts - the
// portfolio's "Automation Examples" panel renders this exact file, not a
// hypothetical one, so keep this file's content and this file's copy in
// codeExamples.ts in sync if either changes.
let writeText: ReturnType<typeof vi.fn>

describe('CopyButton', () => {
  beforeEach(() => {
    // jsdom 30's navigator.clipboard is a live getter that hands back a
    // fresh instance on every access, so mutating the object it returns
    // doesn't stick - own the getter instead so every read resolves to the
    // same mock. userEvent.setup() installs its own clipboard stub that
    // would clobber this, so these tests click via fireEvent instead.
    writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      get: () => ({ writeText }),
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('mounts with a "Copy code" label', () => {
    render(<CopyButton text="npx playwright test" />)
    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument()
  })

  it('copies its text to the clipboard on click', async () => {
    render(<CopyButton text="npx playwright test" />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
    })

    expect(writeText).toHaveBeenCalledWith('npx playwright test')
  })

  it('flips its label to "Copied" and back after ~1500ms', async () => {
    vi.useFakeTimers()
    render(<CopyButton text="npx playwright test" />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Copy code' }))
    })
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    expect(screen.getByRole('button', { name: 'Copy code' })).toBeInTheDocument()
  })
})
`,
      },
      {
        filename: 'src/components/molecules/SegmentedControl/SegmentedControl.test.tsx',
        language: 'typescript',
        code: `import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SegmentedControl from './SegmentedControl'

describe('SegmentedControl', () => {
  it('renders every option and marks the active one checked', () => {
    render(
      <SegmentedControl
        value="b"
        onChange={() => {}}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        ariaLabel="Letters"
      />,
    )

    expect(screen.getByRole('radio', { name: 'A' })).toHaveAttribute('data-state', 'unchecked')
    expect(screen.getByRole('radio', { name: 'B' })).toHaveAttribute('data-state', 'checked')
  })

  it('calls onChange with the clicked option value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl
        value="a"
        onChange={onChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        ariaLabel="Letters"
      />,
    )

    await user.click(screen.getByRole('radio', { name: 'B' }))

    expect(onChange).toHaveBeenCalledWith('b')
  })

  it('never fires onChange for a disabled option and renders it as soon', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <SegmentedControl
        value="a"
        onChange={onChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ]}
        ariaLabel="Letters"
      />,
    )

    const disabledOption = screen.getByRole('radio', { name: /B/ })
    expect(disabledOption).toBeDisabled()

    await user.click(disabledOption)

    expect(onChange).not.toHaveBeenCalled()
  })
})
`,
      },
      {
        filename: 'src/test/setup.ts',
        language: 'typescript',
        code: `import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

// jsdom doesn't implement matchMedia at all. Default to "no preference matched"
// so components that check media queries don't crash in tests that aren't
// specifically exercising that behavior. Individual tests can still override
// this with vi.stubGlobal('matchMedia', ...) for a specific query result.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

// jsdom doesn't implement IntersectionObserver either. This stub never fires
// its callback, so components relying on it just keep their initial state
// during tests that aren't specifically exercising intersection behavior.
if (!window.IntersectionObserver) {
  class IntersectionObserverStub implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ''
    readonly scrollMargin = ''
    readonly thresholds: ReadonlyArray<number> = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }

  window.IntersectionObserver = IntersectionObserverStub
}

// jsdom doesn't implement ResizeObserver either (used by ReadMoreText to
// detect line-clamp truncation). This stub never fires, so components
// relying on it just keep their initial (untruncated) state during tests
// that aren't specifically exercising that behavior - see ReadMoreText's
// own test file for one that overrides it to simulate overflow.
if (!window.ResizeObserver) {
  class ResizeObserverStub implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserverStub
}
`,
      },
    ],
  },
  // src/components/atoms/CopyButton/CopyButton.cy.tsx,
  // src/components/molecules/SegmentedControl/SegmentedControl.cy.tsx and
  // cypress/support/component.ts, verbatim. Same two components, same three
  // behaviors each, as the Vitest example above - deliberately redundant
  // coverage, mounted through Cypress's real Chrome instead of jsdom. It
  // exists so the Component tier can offer a genuine framework choice the
  // same way the E2E tier does, not because jsdom was ever insufficient.
  // component.ts is the CT equivalent of setup.ts: shared support/config
  // Cypress loads before every spec (custom `cy.mount`, global CSS).
  {
    id: 'cypress-ct-component-tests',
    testingType: 'component',
    framework: 'cypress',
    files: [
      {
        filename: 'src/components/atoms/CopyButton/CopyButton.cy.tsx',
        language: 'typescript',
        code: `import CopyButton from './CopyButton'

// Deliberately redundant with CopyButton.test.tsx (Vitest + React Testing
// Library): same component, same three behaviors, run through Cypress's
// real-browser mount instead of jsdom. That's the point - the Component
// tier of the portfolio's "Automation Examples" panel offers a Vitest vs.
// Cypress choice the same way the E2E tier offers Playwright vs. Cypress.
// Featured verbatim as the Component/Cypress example in codeExamples.ts -
// keep this file's content and that copy in sync if either changes.
describe('CopyButton', () => {
  beforeEach(() => {
    // Real Chrome's navigator.clipboard needs OS-level permission (and a
    // secure context) to actually write, neither of which the component
    // test runner grants - stub it the same way the Vitest test stubs
    // jsdom's copy.
    cy.window().then((win) => {
      const writeText = cy.stub().as('writeText').resolves()
      Object.defineProperty(win.navigator, 'clipboard', {
        configurable: true,
        value: { writeText },
      })
    })
  })

  it('mounts with a "Copy code" label', () => {
    cy.mount(<CopyButton text="npx playwright test" />)
    cy.findByRole('button', { name: 'Copy code' }).should('exist')
  })

  it('copies its text to the clipboard on click', () => {
    cy.mount(<CopyButton text="npx playwright test" />)

    cy.findByRole('button', { name: 'Copy code' }).click()

    cy.get('@writeText').should('have.been.calledWith', 'npx playwright test')
  })

  it('flips its label to "Copied" and back after ~1500ms', () => {
    cy.clock()
    cy.mount(<CopyButton text="npx playwright test" />)

    cy.findByRole('button', { name: 'Copy code' }).click()
    cy.findByRole('button', { name: 'Copied' }).should('exist')

    cy.tick(1500)

    cy.findByRole('button', { name: 'Copy code' }).should('exist')
  })
})
`,
      },
      {
        filename: 'src/components/molecules/SegmentedControl/SegmentedControl.cy.tsx',
        language: 'typescript',
        code: `import SegmentedControl from './SegmentedControl'

// Deliberately redundant with SegmentedControl.test.tsx (Vitest + React
// Testing Library): same component, same three behaviors, run through
// Cypress's real-browser mount instead of jsdom. Featured verbatim as the
// Component/Cypress example in codeExamples.ts - keep this file's content
// and that copy in sync if either changes.
describe('SegmentedControl', () => {
  it('renders every option and marks the active one checked', () => {
    cy.mount(
      <SegmentedControl
        value="b"
        onChange={() => {}}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        ariaLabel="Letters"
      />,
    )

    cy.findByRole('radio', { name: 'A' }).should('have.attr', 'data-state', 'unchecked')
    cy.findByRole('radio', { name: 'B' }).should('have.attr', 'data-state', 'checked')
  })

  it('calls onChange with the clicked option value', () => {
    const onChange = cy.stub().as('onChange')
    cy.mount(
      <SegmentedControl
        value="a"
        onChange={onChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B' },
        ]}
        ariaLabel="Letters"
      />,
    )

    cy.findByRole('radio', { name: 'B' }).click()

    cy.get('@onChange').should('have.been.calledWith', 'b')
  })

  it('never fires onChange for a disabled option and renders it as soon', () => {
    const onChange = cy.stub().as('onChange')
    cy.mount(
      <SegmentedControl
        value="a"
        onChange={onChange}
        options={[
          { value: 'a', label: 'A' },
          { value: 'b', label: 'B', disabled: true },
        ]}
        ariaLabel="Letters"
      />,
    )

    cy.findByRole('radio', { name: /B/ }).should('be.disabled')
    cy.findByRole('radio', { name: /B/ }).click({ force: true })

    cy.get('@onChange').should('not.have.been.called')
  })
})
`,
      },
      {
        filename: 'cypress/support/component.ts',
        language: 'typescript',
        code: `import { mount } from 'cypress/react'
import '@testing-library/cypress/add-commands'
import '../../src/index.css'

declare global {
  // Cypress's own recommended pattern for typing custom commands requires
  // augmenting the global Cypress.Chainable namespace, which only a \`declare
  // namespace\` block can do.
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
    }
  }
}

Cypress.Commands.add('mount', mount)
`,
      },
    ],
  },
] as const
