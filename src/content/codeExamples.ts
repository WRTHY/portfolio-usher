// Literal-string content model, intentionally simple for now: each file's
// `code` is copied verbatim from the real file it names (see the comment on
// each example below for exactly which one), so this panel never drifts
// into showing invented code. A future pass may move this to a step-based
// schema (a list of `{ action, target, label }` steps) so the same source
// can drive both the rendered code *and* a live playback demo against the
// page — that generator/player is out of scope here.

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
  // suite — start from the scenario/assertions, follow a locator into the
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

const CASE_STUDY_ID = 'CS 1'
const CASE_STUDY_TITLE = \`Building E2E Test Automation From Zero for Eventric's Flagship Desktop App\`

test.describe('case study modal', () => {
  test('clicking a tile opens the modal with that case study', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage

    await caseStudies.open(CASE_STUDY_ID)

    const { modal } = caseStudies
    await expect(modal.dialog).toBeVisible()
    await expect(modal.title).toHaveText(CASE_STUDY_TITLE)
  })

  test('Escape closes the modal and returns focus to the trigger', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ID)

    await caseStudies.open(CASE_STUDY_ID)
    await expect(caseStudies.modal.dialog).toBeVisible()

    await caseStudies.modal.closeWithEscape()
    await expect(caseStudies.modal.dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })

  test('the close button closes the modal and returns focus to the trigger', async ({ portfolioPage }) => {
    await portfolioPage.goto()
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ID)

    await caseStudies.open(CASE_STUDY_ID)
    await expect(caseStudies.modal.dialog).toBeVisible()

    await caseStudies.modal.close()
    await expect(caseStudies.modal.dialog).not.toBeVisible()
    await expect(trigger).toBeFocused()
  })
})
`,
      },
      {
        filename: 'playwright/pages/CaseStudiesSection.page.ts',
        language: 'typescript',
        code: `import type { Locator, Page } from '@playwright/test'
import { CaseStudyModal } from './CaseStudyModal.page'

export class CaseStudiesSection {
  private readonly page: Page
  readonly section: Locator
  readonly modal: CaseStudyModal

  constructor(page: Page) {
    this.page = page
    this.section = page.locator('#case-studies')
    this.modal = new CaseStudyModal(page)
  }

  tile(caseStudyId: string): Locator {
    return this.page.getByTestId(\`case-study-card-\${caseStudyId}\`)
  }

  async open(caseStudyId: string) {
    await this.tile(caseStudyId).click()
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
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  // Firefox/WebKit are left out for now: Firefox's binary won't spawn in
  // this sandboxed dev environment, and WebKit has a genuine pre-existing
  // focus-restoration bug in Modal.tsx (its useEffect cleanup calls
  // .focus() too late for WebKit to honor it) that's a separate fix.
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
  // apples-to-apples) — including the real difference between them: Cypress
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

const CASE_STUDY_ID = 'CS 1'
const CASE_STUDY_TITLE = \`Building E2E Test Automation From Zero for Eventric's Flagship Desktop App\`

describe('case study modal', () => {
  const portfolioPage = new PortfolioPage()

  beforeEach(() => {
    portfolioPage.visit()
  })

  it('clicking a tile opens the modal with that case study', () => {
    const { caseStudies } = portfolioPage

    caseStudies.open(CASE_STUDY_ID)

    const { modal } = caseStudies
    modal.dialog.should('be.visible')
    modal.title.should('have.text', CASE_STUDY_TITLE)
  })

  it('Escape closes the modal and returns focus to the trigger', () => {
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ID)

    caseStudies.open(CASE_STUDY_ID)
    caseStudies.modal.dialog.should('be.visible')

    caseStudies.modal.closeWithEscape()
    caseStudies.modal.dialog.should('not.exist')
    trigger.should('have.focus')
  })

  it('the close button closes the modal and returns focus to the trigger', () => {
    const { caseStudies } = portfolioPage
    const trigger = caseStudies.tile(CASE_STUDY_ID)

    caseStudies.open(CASE_STUDY_ID)
    caseStudies.modal.dialog.should('be.visible')

    caseStudies.modal.close()
    caseStudies.modal.dialog.should('not.exist')
    trigger.should('have.focus')
  })
})
`,
      },
      {
        filename: 'cypress/pages/CaseStudiesSection.page.ts',
        language: 'typescript',
        code: `import { CaseStudyModal } from './CaseStudyModal.page'

export class CaseStudiesSection {
  readonly modal = new CaseStudyModal()

  get section(): Cypress.Chainable<JQuery> {
    return cy.get('#case-studies')
  }

  tile(caseStudyId: string): Cypress.Chainable<JQuery> {
    return cy.findByTestId(\`case-study-card-\${caseStudyId}\`)
  }

  open(caseStudyId: string) {
    this.tile(caseStudyId).click()
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

export type { SectionId }

// Composition root for the site. It's a single page with no real per-URL
// navigation, so rather than one class per route this models one root
// object owning a component per section/region — the same shape the app
// itself uses (Header/Sidebar/CaseStudies/CodeSamples as siblings).
export class PortfolioPage {
  readonly nav = new NavComponent()
  readonly themeToggle = new ThemeToggleComponent()
  readonly caseStudies = new CaseStudiesSection()
  readonly codeSamples = new CodeSamplesSection()

  visit() {
    cy.visit('/')
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
  // instead — see that example's comment for how they compare. CopyButton
  // covers interaction/mocked-clipboard/fake timers; SegmentedControl
  // covers the accessibility semantics (ARIA role, disabled state); setup.ts
  // is the shared jsdom config both rely on — Component's answer to the
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

// Featured verbatim as the Component/Vitest example in codeExamples.ts — the
// portfolio's "Automation Examples" panel renders this exact file, not a
// hypothetical one, so keep this file's content and this file's copy in
// codeExamples.ts in sync if either changes.
let writeText: ReturnType<typeof vi.fn>

describe('CopyButton', () => {
  beforeEach(() => {
    // jsdom 30's navigator.clipboard is a live getter that hands back a
    // fresh instance on every access, so mutating the object it returns
    // doesn't stick — own the getter instead so every read resolves to the
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
        code: `import type { ReactNode } from 'react'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

// jsdom's canvas has no transferControlToOffscreen, so the real engine throws
// (as an unhandled rejection, since Particles doesn't await its load call)
// the moment ParticleBackground mounts. Every section renders one now, so
// stub the engine boundary globally rather than repeating this per test file.
vi.mock('@tsparticles/react', () => ({
  ParticlesProvider: ({ children }: { children: ReactNode }) => children,
  Particles: () => null,
}))

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
`,
      },
    ],
  },
  // src/components/atoms/CopyButton/CopyButton.cy.tsx,
  // src/components/molecules/SegmentedControl/SegmentedControl.cy.tsx and
  // cypress/support/component.ts, verbatim. Same two components, same three
  // behaviors each, as the Vitest example above — deliberately redundant
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
// real-browser mount instead of jsdom. That's the point — the Component
// tier of the portfolio's "Automation Examples" panel offers a Vitest vs.
// Cypress choice the same way the E2E tier offers Playwright vs. Cypress.
// Featured verbatim as the Component/Cypress example in codeExamples.ts —
// keep this file's content and that copy in sync if either changes.
describe('CopyButton', () => {
  beforeEach(() => {
    // Real Chrome's navigator.clipboard needs OS-level permission (and a
    // secure context) to actually write, neither of which the component
    // test runner grants — stub it the same way the Vitest test stubs
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
// Component/Cypress example in codeExamples.ts — keep this file's content
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
