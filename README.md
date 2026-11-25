# James Usher - Portfolio

[![CI](https://github.com/WRTHY/portfolio-usher/actions/workflows/ci.yml/badge.svg)](https://github.com/WRTHY/portfolio-usher/actions/workflows/ci.yml)

1. Static checks: [![ESLint & TypeScript](https://img.shields.io/github/check-runs/WRTHY/portfolio-usher/master?nameFilter=Static%20checks%20%2F%20ESLint%20%26%20TypeScript&label=ESLint%20%26%20TypeScript)](https://github.com/WRTHY/portfolio-usher/actions/workflows/ci.yml) [![Vite build](https://img.shields.io/github/check-runs/WRTHY/portfolio-usher/master?nameFilter=Static%20checks%20%2F%20Vite%20Production%20Build&label=Vite%20build)](https://github.com/WRTHY/portfolio-usher/actions/workflows/ci.yml)
2. Fast tests: [![Vitest](https://img.shields.io/github/check-runs/WRTHY/portfolio-usher/master?nameFilter=Unit%20%2F%20Vitest&label=Vitest)](https://github.com/WRTHY/portfolio-usher/actions/workflows/ci.yml) [![Cypress component](https://img.shields.io/github/check-runs/WRTHY/portfolio-usher/master?nameFilter=Component%20%2F%20Cypress&label=Cypress%20component)](https://github.com/WRTHY/portfolio-usher/actions/workflows/ci.yml)
3. End-to-end: [![Playwright](https://img.shields.io/github/check-runs/WRTHY/portfolio-usher/master?nameFilter=End-to-end%20%2F%20Playwright&label=Playwright)](https://github.com/WRTHY/portfolio-usher/actions/workflows/ci.yml) [![Cypress E2E](https://img.shields.io/github/check-runs/WRTHY/portfolio-usher/master?nameFilter=End-to-end%20%2F%20Cypress&label=Cypress%20E2E)](https://github.com/WRTHY/portfolio-usher/actions/workflows/ci.yml)

My personal portfolio site: a single-page React app introducing me, walking through my
work history and a few case studies, and showing off some hands-on test automation
examples. Built as much to *demonstrate* how I approach frontend quality as it is to be
a portfolio - it's covered by unit tests, component tests, end-to-end tests, and
automated accessibility checks.

A production version of the app is live [here](https://jamesusher.vercel.app/)

Live sections (see [`src/content/navigation.ts`](src/content/navigation.ts)):

- **Hero** - name, pitch and resume, with my career outcomes formatted as a passing test
  run. On the first visit of a session it plays in as a short terminal opener (skippable,
  and never shown with reduced motion). Its **Pick locator** switch turns the hero into a
  locator inspector: hover, tap or Tab to anything to see its page locator and a passing
  assertion. Every locator shown is executed by
  [`e2e/playwright/hero.spec.ts`](e2e/playwright/hero.spec.ts), at desktop and phone sizes.
- **Experience** - a ledger, one row per role: dates, role and company, a one-sentence
  impact line and up to four test tools, each with what it tested. The "+" (or a click
  anywhere on the row) unfolds the role's detail bullets and grows the tools column into
  its full stack, in one CSS-only motion. The degree closes the ledger. A git-graph rail runs down the left edge: one node per role
  on a single line, lit while its role is open (content in
  [`src/content/experience.ts`](src/content/experience.ts))
- **Projects** - the one violet section, holding two numbered projects, indexed beside its
  title. 01 is this site's own testing, drawn as its CI pipeline (see [CI/CD](#cicd)): three
  tiers, cheapest first, each gating the next; choosing a stage shows its tests and the
  workflow that runs them, and the first tier shows the pipeline file itself. The drawing is
  checked against `.github/workflows/` by a test, each stage's test count is generated at
  build time by [`scripts/count-tests.mjs`](scripts/count-tests.mjs), and the code is
  imported straight from the repo (`?raw`) and checked against each file's path, so none
  of it can drift from the suite. 02 is a separate API test suite against a third-party API
  (Postman, then Playwright), as a row that opens in place
- **Case Studies** - a second ledger of write-ups on engineering decisions I've made and
  implemented. Each row leads with its outcome figure; the "+" (or a click on the row)
  opens the full write-up in place (problem → approach → outcome → future iterations),
  with no modal (content in [`src/content/caseStudies.ts`](src/content/caseStudies.ts))

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) via [Vite](https://vite.dev/)
- [Radix UI](https://www.radix-ui.com/) primitives (tabs, radio group) for accessible interactive bits
- [Shiki](https://shiki.style/), run at build time (see `scripts/highlight.ts`), for the syntax-highlighted code samples, so the browser ships no highlighter
- CSS Modules for styling, with a Cream & Violet palette in light and dark mode (tokens in
  [`src/index.css`](src/index.css))
- Type: TBJ Orcherum Mini (display), [General Sans](https://www.fontshare.com/fonts/general-sans)
  (body) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/) (code and test output)

## Project structure

Components follow atomic design, colocated with their styles and tests:

```
src/
  components/
    atoms/       # Badge, Button, CopyButton, ExpandToggle, Heading, IconButton,
                 # MenuToggle, NavLink, Reveal, SocialIcon, SoonBadge, Switch,
                 # icons/
    molecules/   # CareerGraph, CodeBlock, CodeFileTabs, CodePanel, LocatorInspector,
                 # Nav, PanelFooter, PipelineStages, RunReport, SectionDots,
                 # SectionHeader, SegmentedControl, SkillsAndTools, SocialLinks,
                 # SpringName, ThemeToggle
    organisms/   # Opener (one-time terminal intro), Header (sticky top bar),
                 # Sidebar (desktop left rail: section dots, theme toggle,
                 # socials), Hero, Experience, Projects, CaseStudies, Contact,
                 # Footer
    templates/   # PortfolioTemplate - assembles the page
  content/       # Site copy and data (hero and test run, experience, case
                 # studies, projects, code examples, contact, test counts, nav)
  hooks/         # useAccordion, useActiveSection, useElementInView,
                 # useOverAccentSurface, usePrefersReducedMotion
  styles/        # Shared CSS modules (the ledger rows' hover lift, code colors)
  utils/         # Small helpers (class names, locator attributes, row clicks)
```

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Fetch fonts and the API examples, count the tests, type-check, and build for production |
| `npm run count:tests` | Recount the tests per suite for the Projects section |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run the full suite: unit tests, Cypress component tests, then Playwright, then Cypress e2e |
| `npm run test:unit` | Run unit tests once |
| `npm run test:unit:watch` | Run unit tests in watch mode |
| `npm run test:component:cypress` | Run the Cypress component-test suite headlessly |
| `npm run test:component:cypress:ui` | Open the Cypress component-test suite in interactive UI mode |
| `npm run test:e2e:playwright` | Run the Playwright end-to-end suite headlessly |
| `npm run test:e2e:playwright:ui` | Open the Playwright suite in interactive UI mode |
| `npm run test:e2e:cypress` | Run the Cypress end-to-end suite headlessly (starts the dev server itself) |
| `npm run test:e2e:cypress:ui` | Open the Cypress end-to-end suite in interactive UI mode (starts the dev server itself) |

## Testing

**Unit tests** ([Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)) live
next to the component they cover (`Component.test.tsx`), exercising rendering, props,
and interaction behavior in isolation.

**Component tests** also exist as a parallel Cypress Component Testing suite
(`Component.cy.tsx`, e.g. [`CopyButton.cy.tsx`](src/components/atoms/CopyButton/CopyButton.cy.tsx),
[`SegmentedControl.cy.tsx`](src/components/molecules/SegmentedControl/SegmentedControl.cy.tsx)),
mounting the same components in a real browser and asserting the same behavior as their
Vitest counterparts - deliberately redundant coverage, so the Projects panel
can offer a genuine framework choice (Vitest vs. Cypress) at the component tier, the same
way it does at the E2E tier. See [`cypress.config.ts`](cypress.config.ts).

**End-to-end tests** live under [`e2e/`](e2e), one subfolder per framework, covering the
same scenarios - navigation, opening and closing case studies, the Projects panel, theme
switching, and accessibility - against a Page Object Model in each:

- [`e2e/playwright/`](e2e/playwright) ([pages](e2e/playwright/pages)) - the original suite
- [`e2e/cypress/`](e2e/cypress) ([pages](e2e/cypress/pages)) - a 1:1 Cypress port

`e2e/` is deliberately scoped to hold further sibling implementations later (Python,
Java), so each framework's specs live in their own subfolder rather than at the top
level.

**Accessibility** is checked as part of both E2E suites
([`accessibility.spec.ts`](e2e/playwright/accessibility.spec.ts),
[`accessibility.cy.ts`](e2e/cypress/accessibility.cy.ts)), using
[`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm) /
[`cypress-axe`](https://github.com/component-driven/cypress-axe) to scan for WCAG 2.1 AA
violations - on the default page, with a case study open, in dark mode, and on a
mobile viewport with the nav menu open.

Playwright is currently configured for Chromium only: Firefox's binary doesn't spawn in
the sandboxed dev environment this was built in, and WebKit hasn't been re-verified since
the case-study modal (whose focus bug kept it out) was replaced. See
[`playwright.config.ts`](playwright.config.ts).
Cypress runs against Electron in the same environment; verifying it required
`--disable-gpu` on `ELECTRON_EXTRA_LAUNCH_ARGS` to avoid a GPU-process crash, and even
then a couple of specs showed sandbox-specific rendering flakiness across sequential
tests in one run (each passes in isolation) - see [`cypress.config.ts`](cypress.config.ts).

## CI/CD

Every push to `master` and every pull request runs one pipeline,
[`ci.yml`](.github/workflows/ci.yml), in three tiers, cheapest first. Each tier starts
only once every job before it has passed, so a failure stops everything after it: a lint
error is reported in seconds, without spending minutes of browser time on end-to-end tests
for a commit that's already broken. Jobs within a tier run in parallel, so a green run isn't
slowed down more than it has to be.

| Tier | Workflow (called by `ci.yml`) | Jobs | What it runs |
| --- | --- | --- | --- |
| 1. Static checks | [`lint-and-build.yml`](.github/workflows/lint-and-build.yml) | `ESLint & TypeScript`, `Vite Production Build` | ESLint + `tsc -b`, then a full production build |
| 2. Fast tests | [`unit-tests.yml`](.github/workflows/unit-tests.yml) | `Vitest` | `npm run test:unit` |
| 2. Fast tests | [`component-tests.yml`](.github/workflows/component-tests.yml) | `Cypress` | `cypress run --component` |
| 3. End-to-end | [`e2e-tests.yml`](.github/workflows/e2e-tests.yml) | `Playwright`, `Cypress` | Both e2e suites, side by side |

Each tier is its own reusable workflow (`workflow_call`), so `ci.yml` is just the joins
between them. None of them triggers on a push or pull request itself, so nothing runs
twice, but each can still be run on its own from the Actions tab (`workflow_dispatch`).
Checks show as `CI / <tier> / <job>`, e.g. `CI / End-to-end / Playwright`, so branch
protection requires those names. The badges at the top read the same checks on `master`, one per job
(via shields.io), so each tier's result shows on its own. Each e2e/component job uploads its screenshots, videos,
or HTML report as a build artifact on failure (Playwright's report is uploaded even on
success), so a failure can be diagnosed from the Actions run without reproducing it
locally.

The Projects section draws this pipeline, and
[`src/content/pipeline.test.ts`](src/content/pipeline.test.ts) checks the drawing
against the workflow files (the tiers, what each needs, the job names, the artifacts), so
the page can't claim something CI doesn't do.

## Notes

- The resume PDF is served from [`public/James_Usher_Resume.pdf`](public/James_Usher_Resume.pdf).
- `public/fonts/` (a licensed webfont) is gitignored and not part of this repo.
