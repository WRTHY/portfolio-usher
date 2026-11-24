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

1. **Prototype**: this folder. *Done.*
2. **Tokens and type**: new palette and fonts in `index.css`; retire the theme registry; rewrite
   DESIGN.md. *Done.*
3. **Strip the chrome**: remove Sidebar dots, InfoPanel, MobileInfoCard and ParticleBackground
   (drops `tsparticles`); add a sticky top nav; update page objects and specs. *Done, with the
   left rail brought back (see decisions).*
4. **Hero and opener**: the Hero organism, the opener (session-once, reduced-motion safe, skippable)
   and the spring name, with unit and E2E coverage. *Done.*
5. **Experience ledger**: add `impact` and `keyTools` to `experience.ts`; replace the cards.
   *Done.*
6. **Case studies**: outcome-led rows with an in-place expand that replaces the modal; update the
   case-study specs. *Done.*
7. **Projects section** (named "Proof" in the prototype): merge Automation Examples and API
   Testing; generate test counts at build time; replace the hand-copied code in
   `codeExamples.ts` with imports of the real files, so the panel can't drift. *Done.*
8. **Close and About cut**: contact close and footer; reduce About to the hero line.
9. **Weight pass**: keep one icon library (both `react-icons` and `@iconify/react` are still in),
   move Shiki highlighting to build time, and record Lighthouse and bundle sizes before and after.
10. **Copy pass**: James rewrites, in his own words, every line of copy that Claude wrote or that
    came in from another chat. The local `COPY.md` sheet lists each one with its current text and
    limits; layout is fitted to the new text afterwards. Added after stage 6, when that copy was
    found to read as robotic.

## Decisions made along the way

Intentional changes to the plan or the prototype, made or approved by James as the stages landed.

- **Brand:** keep TBJ Orcherum Mini as the display face and the Cream & Violet palette, in light
  and dark.
- **Wording:** "page locator", not "Playwright locator" (Cypress uses the same locators). The
  merged section's nav item is "Projects", not "Proof".
- **Left rail (stage 3):** the plan removed the Sidebar; James brought back a minimal left rail on
  desktop: section dots, the light/dark toggle, and GitHub, email and LinkedIn. No InfoPanel.
  Section links stay in the top bar (inline from 1024px, a menu below that).
- **Hero (stage 4):** the name is stacked on two lines (a one-line version was tried and dropped).
  The name is never on screen twice: the header wordmark animates in only once the hero's name has
  scrolled away. Pick locator is a switch on the hero, outside the terminal panel, and turns off
  when the hero is left. Availability: "San Francisco, Chicago, or remote".
- **Experience (stage 5):**
  - A git-graph rail down the left edge, chosen over a tenure bar and pipeline stages, then
    simplified to circles on one straight line. No node is filled at rest, since no role is a
    current one; an open role's node fills and a hovered row's node rings.
  - Key tools are test tools, each with what it tested, at most four. Manual test tools added:
    Qase (SDET), TestRail (Fubo), Zephyr (Scientific Games). Cucumber dropped from Fubo.
  - Opening a role unfolds its bullets and grows the tools column into the rest of the stack, in
    one motion; the open and close are animated.
  - The whole row is clickable. No dividers between rows; hovering lifts a row onto a soft card
    and fills its "+".
  - Row columns line up on the tops of their capitals, whatever the font.
  - The Rose-Hulman degree (B.S. Computer Engineering, May 2019) closes the ledger as the
    timeline's root.
- **Projects (stage 7):** keep every example, in one panel. The prototype showed only the
  case-study spec; the built section keeps all of Automation Examples (End-to-End and
  Component, both frameworks each) and API Testing (Playwright and Postman, now an API tab in
  the same panel), so nothing that was on the page is lost.
  - **Layout, after two passes read as crammed and too wordy:** the headline is that this
    site is automated. Its project leads: a short description, then its CI pipeline drawn as
    a micrographic (trigger, four parallel workflows) that is also how its code is browsed
    (choose a stage, see its tests), then a full-width, height-capped code panel. A test-count
    headline number was tried and dropped as "a number for its own sake"; counts survive only
    in small type on each stage. The API suite tests a third-party API, not this site, so it's
    a separate project: a row under the site's, with its name and one line visible, opening in
    place to its intro and code. "Projects (2)" in the title says there are two. Carousels and
    a separate API section were considered and turned down (hidden content; a thin section).
    The footer's "Live demo - coming soon" pill and disabled Run button were dropped, and so
    was the Performance "coming soon" option (CI has no performance stage to show).
  - **CI staged into tiers, for real (James's call):** the pipeline was drawn left to right
    with cheaper tests failing first, but CI ran its four workflows in parallel, so the
    drawing would have been untrue. CI now runs as one pipeline, `ci.yml`, in three tiers
    (static checks; unit and component side by side; end-to-end), each starting only once
    everything before it passed. At James's ask the four workflows stay separate files, as
    reusable workflows `ci.yml` calls, so each can still be run on its own. The diagram
    shows the tiers with arrows, starting from a node for `ci.yml` itself, which opens
    the pipeline file (James's call: it runs every tier, so it isn't a static check).
    Static checks opens the lint rules (`eslint.config.js`) instead; every stage's code
    ends with the workflow that runs it. Branch protection's required checks need the
    new `<tier> / <job>` names once this is pushed.
  - **Projects numbered and compacted:** "01" and "02" on the two projects, an index of both
    beside the title, and tighter spacing throughout.
  - **Both projects are rows; the index opens one (James's call):** 01 now folds away like
    02, starting open. A jump from the index opens only the project it names, folds the
    other, and brings it to the top of the page, so the reader lands on it whichever was
    open. Each project's GitHub link ("Repo in Github", James's) sits beside its name, so
    02's shows while it's closed; its accessible name adds the project's. 01's its headline is James's ("This portfolio
    tests itself"), and its description is set in regular weight. The "Cheapest first" line
    under the pipeline was dropped (James's call); the arrows carry the order.
- **Local docs:** DESIGN.md and PRODUCT.md stay out of the repo for now (`.gitignore`: "not ready
  for the public repo yet"), so the plan and these lists live here.

## Drift

Changes nobody asked for or approved up front, named so they're deliberate from here on. Each is
either kept with a reason or slated to change.

- **Copy (to stage 10).** The Experience intro, impact lines and detail bullets came almost word
  for word from another chat's answer and replaced James's own summaries. The hero pitch, the
  test-run lines, the locator hint and small labels ("Also in the stack", "Close case study", the
  tool notes, CS 1's "7 phases / Zero to one, built in a set order") were written by Claude. All
  are listed in `COPY.md` for James to rewrite.
- **Case studies use a button and an animated region, not `<details>` (kept).** The plan said
  `<details>`. A disclosure button (`aria-expanded`, `aria-controls`) over the shared Reveal
  region opens and closes with the same motion as Experience in every browser; `<details>` can't
  animate its close outside Chromium.
- **Case-study rows have no one-line deck (kept for now).** The prototype put a short line under
  each title; the built rows don't, because the existing summaries run two to four sentences. The
  summary opens the write-up instead. Revisit in stage 10 if James writes short decks.
- **CS 1 leads with "7 phases", not the prototype's "0 → 1" (to stage 10).**
- **Case-study rows lift on hover and open from a click anywhere (kept).** Extended from
  Experience for consistency, without a separate ask.
- **Case-study tags are plain mono text, not coloured badges (kept).** Matches the ledger;
  `SkillBadge` was deleted.
- **A "Close case study" control ends each write-up (kept).** Write-ups are long; it returns focus
  and the view to the row.
- **Embedded code copies drifted (fixed in stage 7).** The panel showed hand-copied files, and
  they had drifted from the real ones (one showed the wrong case study). Stage 7 replaced the
  copies with `?raw` imports of the files themselves, plus a test that checks every file the
  panel shows against the file at its path.
- **The code panel numbered lines 2, 4, 6... (fixed in stage 7).** react-shiki now counts lines
  itself, and the site's own counter doubled it. Found while building stage 7.
- **Projects wording is mostly placeholder (to stage 10).** The site project's headline and
  description, both repo links, and the API suite's lead and intro are James's own; the API
  suite's name and one-liner, and the pipeline's labels, are Claude's. All are in `COPY.md`, with the explainer that was
  dropped from the page.
- **Code panels could show an empty box (fixed in stage 7).** react-shiki draws nothing until
  its highlighting resolves, and nothing ever if a language's grammar fails to load (as YAML's
  did, from a stale Vite cache). The code is now drawn plain first, in the theme's colours, and
  the highlighted version replaces it.
- **Test counts add about 30 seconds to `npm run build` (kept).** Counting Vitest's tests means
  loading every test file; Playwright lists its own quickly, and Cypress specs are counted
  statically (the script refuses a spec whose tests it can't count that way). A suite that
  can't be counted keeps its last committed number, so a deploy never breaks on it.
- **The left rail was faint over the violet section (fixed after stage 7, at James's ask).**
  Each part of the rail (dots, theme toggle, socials) now switches to the violet field's colours
  on its own while its middle is over a section marked `data-surface="accent"`.
- **WebKit is still left out of Playwright (open).** It was excluded for the old modal's focus
  bug; the modal is gone but WebKit hasn't been re-verified.
