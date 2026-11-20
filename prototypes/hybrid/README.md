# Hybrid redesign prototype

A standalone, single-file prototype of the redesign direction: a light, minimal page with a
one-time "test runner" opener that resolves into the name. It isn't wired into the React app
and isn't part of the production build. It's here so the direction can be reviewed before any
components change.

## Viewing it

```bash
npm run dev
```

Then open http://localhost:5173/prototypes/hybrid/. The opener plays once per browser session;
add `?intro` to the URL to replay it. It never plays when the OS has reduced motion turned on.

## What it demonstrates

- **Opener**: `james-usher.spec.ts` "runs" in a dark terminal and noise resolves into five
  passing assertions. The overlay then wipes away. It can be skipped with any key or click.
- **Hero**: the name springs in letter by letter, and resume/email are the primary actions. The
  opener's run sits on the right. A **Pick locator** switch above it turns the hero into a locator
  inspector: hover, tap or Tab to the name, pitch, buttons, status, nav links, the run panel or the
  switch itself to see its page locator, then watch the assertion pass. These are role and text
  locators, so the same queries work in Playwright (`getByRole`) and in Cypress through Testing
  Library (`cy.findByRole`). Clicks pick instead of navigating while it's on. Esc, or scrolling
  past the hero, turns it off.
- **Every locator is real**: each tagged element carries its locator and assertion in
  `data-loc` / `data-check`. All 12 were run against this page (in Playwright), along with checks
  that clicks don't navigate while picking, that Esc and scrolling away turn it off, and that the
  Projects link has its section: 16 of 16 passed. Stage 4 turns this into specs in the suite.
- **Experience**: a ledger with one impact line and at most four tools per role.
- **Case studies**: the outcome leads each row, and rows expand in place (no modal).
- **Proof**: the one solid violet section, with real test counts from this repo and the actual
  case-study spec in Playwright and Cypress.
- **Close**: contact, plus the personal line moved out of About.

Brand carried over from the current site: TBJ Orcherum Mini for display, plus the Cream & Violet
palette, which follows the OS light/dark setting. Body text is General Sans (Fontshare), and
JetBrains Mono is used for test output and code only. The brand font loads from `public/fonts`,
which `scripts/fetch-fonts.mjs` fills; without it, headings fall back to General Sans.

## Planned PR stages

1. **Prototype**: this folder.
2. **Tokens and type**: new palette and fonts in `index.css`; retire the theme registry; rewrite
   DESIGN.md.
3. **Strip the chrome**: remove Sidebar dots, InfoPanel, MobileInfoCard and ParticleBackground
   (drops `tsparticles`); add a sticky top nav; update page objects and specs.
4. **Hero and opener**: the Hero organism, the opener (session-once, reduced-motion safe, skippable)
   and the spring name, with unit and E2E coverage.
5. **Experience ledger**: add `impact` and `keyTools` to `experience.ts`; replace the cards.
6. **Case studies**: outcome-led rows with an in-place expand that replaces the modal; update the
   case-study specs.
7. **Proof section**: merge Automation Examples and API Testing; generate test counts at build
   time.
8. **Close and About cut**: contact close and footer; reduce About to the hero line.
9. **Weight pass**: keep one icon library, move Shiki highlighting to build time, and record
   Lighthouse and bundle sizes before and after.
