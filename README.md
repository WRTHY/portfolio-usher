# James Usher — Portfolio

My personal portfolio site: a single-page React app introducing me, walking through my
work history and a few case studies, and showing off some hands-on test automation
examples. Built as much to *demonstrate* how I approach frontend quality as it is to be
a portfolio — it's covered by unit tests, component tests, end-to-end tests, and
automated accessibility checks.

Live sections (see [`src/content/navigation.ts`](src/content/navigation.ts)):

- **About** — background and links
- **Experience** — a card per role, with stack and impact
- **Case Studies** — a card grid of expandable write-ups (problem → approach → outcome)
- **Automation Examples** — a live browser of this repo's own test suite: pick a testing
  type (End-to-End / Component) and a framework (Playwright or Cypress for E2E, Vitest +
  RTL or Cypress Component Testing for Component) and read the real files

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) via [Vite](https://vite.dev/)
- [Radix UI](https://www.radix-ui.com/) primitives (tabs, radio group) for accessible interactive bits
- [tsparticles](https://particles.js.org/) for the background effect
- [react-shiki](https://github.com/avgvstvs96/react-shiki) for syntax-highlighted code samples
- CSS Modules for styling, with light/dark mode and a small registry of swappable
  color themes (see [`src/content/themes.ts`](src/content/themes.ts))

## Project structure

Components follow atomic design, colocated with their styles and tests:

```
src/
  components/
    atoms/       # Badge, Button, CopyButton, FramedImage, Heading, MenuToggle,
                 # NavLink, RunButton, SocialIcon, SoonBadge, icons/ ...
    molecules/   # CodeBlock, CodeFileTabs, FrameworkSwitcher, MediaText, Modal, Nav,
                 # PanelFooter, ParticleBackground, SectionDots, SegmentedControl,
                 # SocialLinks, TextCard, ThemeToggle
    organisms/   # About, Experience, CaseStudies, CodeSamples, Header, Sidebar, InfoPanel
    templates/   # PortfolioTemplate — assembles the page
  content/       # Site copy and data (about copy, experience, case studies, code
                 # examples, nav, themes)
  hooks/         # useActiveSection, useOverscrollBump
```

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Type-check and build for production |
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
Vitest counterparts — deliberately redundant coverage, so the Automation Examples panel
can offer a genuine framework choice (Vitest vs. Cypress) at the component tier, the same
way it does at the E2E tier. See [`cypress.config.ts`](cypress.config.ts).

**End-to-end tests** live under [`e2e/`](e2e), one subfolder per framework, covering the
same scenarios — navigation, the case study modal, the automation-examples panel, theme
switching, and accessibility — against a Page Object Model in each:

- [`e2e/playwright/`](e2e/playwright) ([pages](e2e/playwright/pages)) — the original suite
- [`e2e/cypress/`](e2e/cypress) ([pages](e2e/cypress/pages)) — a 1:1 Cypress port

`e2e/` is deliberately scoped to hold further sibling implementations later (Python,
Java), so each framework's specs live in their own subfolder rather than at the top
level.

**Accessibility** is checked as part of both E2E suites
([`accessibility.spec.ts`](e2e/playwright/accessibility.spec.ts),
[`accessibility.cy.ts`](e2e/cypress/accessibility.cy.ts)), using
[`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm) /
[`cypress-axe`](https://github.com/component-driven/cypress-axe) to scan for WCAG 2.1 AA
violations — on the default page, with the case study modal open, in dark mode, and on a
mobile viewport with the nav menu open.

Playwright is currently configured for Chromium only: Firefox's binary doesn't spawn in
the sandboxed dev environment this was built in, and WebKit has a known focus-restoration
bug in `Modal.tsx` that's tracked separately. See [`playwright.config.ts`](playwright.config.ts).
Cypress runs against Electron in the same environment; verifying it required
`--disable-gpu` on `ELECTRON_EXTRA_LAUNCH_ARGS` to avoid a GPU-process crash, and even
then a couple of specs showed sandbox-specific rendering flakiness across sequential
tests in one run (each passes in isolation) — see [`cypress.config.ts`](cypress.config.ts).

## Notes

- The resume PDF is served from [`public/James_Usher_Resume.pdf`](public/James_Usher_Resume.pdf).
- `public/fonts/` (a licensed webfont) is gitignored and not part of this repo.
