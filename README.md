# James Usher — Portfolio

My personal portfolio site: a single-page React app introducing me, walking through a
few case studies, and showing off some hands-on test automation examples. Built as
much to *demonstrate* how I approach frontend quality as it is to be a portfolio —
it's covered by unit tests, end-to-end tests, and automated accessibility checks.

Live sections (see [`src/content/navigation.ts`](src/content/navigation.ts)):

- **Home** — intro and tagline
- **Case Studies** — a bento grid of expandable write-ups (problem → approach → outcome)
- **Automation Examples** — syntax-highlighted Playwright/Cypress snippets
- **About** — background and links

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
    atoms/       # Button, Badge, NavLink, ...
    molecules/   # Nav, Modal, BentoTile, ThemeToggle, ...
    organisms/   # Header, Hero, CaseStudies, CodeSamples, About, Sidebar
    templates/   # PortfolioTemplate — assembles the page
  content/       # Site copy and data (case studies, code samples, nav, themes)
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
| `npm test` | Run unit tests in watch mode |
| `npm run test:run` | Run unit tests once |
| `npm run test:e2e` | Run the Playwright end-to-end suite |
| `npm run test:e2e:ui` | Run the Playwright suite in UI mode |

## Testing

**Unit tests** ([Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)) live
next to the component they cover (`Component.test.tsx`), exercising rendering, props,
and interaction behavior in isolation.

**End-to-end tests** live under [`e2e/playwright/`](e2e/playwright). They're written
against a Page Object Model (see [`e2e/playwright/pages/`](e2e/playwright/pages)) so
specs read as user behavior rather than raw selectors, and cover navigation, the case
study modal, the code samples panel, and theme switching. `e2e/` is deliberately scoped
to hold sibling implementations of the same scenarios in other tools/languages later
(Cypress, Python, Java), so Playwright specs live in their own subfolder rather than at
the top level.

**Accessibility** is checked as part of the same Playwright suite
([`accessibility.spec.ts`](e2e/playwright/accessibility.spec.ts)), using
[`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm) to scan for WCAG
2.1 AA violations — on the default page, with the case study modal open, in dark mode,
and on a mobile viewport with the nav menu open.

Playwright is currently configured for Chromium only: Firefox's binary doesn't spawn in
the sandboxed dev environment this was built in, and WebKit has a known focus-restoration
bug in `Modal.tsx` that's tracked separately. See [`playwright.config.ts`](playwright.config.ts).

## Notes

- The resume PDF is served from [`public/James_Usher_Resume.pdf`](public/James_Usher_Resume.pdf).
- `public/fonts/` (a licensed webfont) is gitignored and not part of this repo.
