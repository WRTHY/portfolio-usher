export type Highlight = {
  value: string
  label: string
}

export type CaseStudy = {
  id: string
  title: string
  summary: string
  tags: readonly string[]
  problem: string
  approach: string
  outcome: string
  /** Reflections — what I'd do differently or explore next, in hindsight. Optional. */
  futureIterations?: string;
  /** Real thumbnail image, once one exists. Falls back to a gradient placeholder. */
  image?: string;
  /** Small stat callouts shown in the modal's left rail. Optional, any number. */
  highlights?: readonly Highlight[];
}

export const caseStudies: readonly CaseStudy[] = [
  {
    id: "CS 1",
    title: `Building E2E Test Automation From Zero for Eventric's Flagship Desktop App`,
    summary:
      "Master Tour Desktop is an Electron desktop app backed by a local SQLite database that had no existing E2E coverage. As QA Lead, I owned building that test coverage from the ground up.",
    tags: ["Automation", "Playwright", "Electron", "SQLite"],
    problem:
      "Testing on the main desktop product for Eventric was slow and inconsistent. All testing was manual and required significant setup time. As we moved towards faster releases, we needed a more efficient way to regression test the app before release.",
    approach:
      "Because the app is offline-first, our options for E2E automation tooling were limited. I wrote a PRD weighing Playwright against WebDriverIO and chose Playwright for its ease of setup - it's the industry standard for Electron apps - plus a handful of useful out-of-the-box tools like auto-wait, built-in screenshots and video, and session recording. I documented the rollout plan in Confluence, then broke it into epics in Jira before writing a single test. I sequenced test-writing by business value - critical/high volume user flows first, edge cases last, ensuring the team had usable CI coverage early rather than needing months before anything worked. One major design constraint that I ended solving for: Electron plus a local SQLite database meant tests couldn't safely run in parallel. Multiple workers hitting the same local DB caused data collisions when testing similar content areas. Rather than trying to fight that, I designed the suite to run serially and built the framework around it: a shared authenticated-session fixture (avoiding repeated logins from a cold Electron start), a centralized navigation helper, and a page-object layer scaffolded for every major app section up front. The final step was wiring this into CI/CD - I built a Bitbucket Pipelines workflow that ran the suite on command. That command ran the full suite on every PR, and again on a weekly schedule.",
    outcome:
      "Framework foundations and the highest-value test tier shipped first, becoming the base every later suite was built on. Regression testing on release candidates went from fully manual to automated, with spot checks limited to feature-specific changes. On average, validating the critical paths dropped from ~4 hours to ~10 minutes. Weekly runs also confirmed that no regressions had occurred outside the scope of client code, building historical confidence in the product's stability.",
    futureIterations:
      "Communication of test results remained a major pain point. Down the road, I'd like to log results directly on the PR that triggered the pipeline and add a Slack channel that flags failures and regressions automatically. Without this piece QA is required to check and relay run results manually to the development team.\n\n\nI'd also like to match test scope to the CI trigger. Right now the full suite runs on every trigger, even when only a small subset of the pipeline actually changed. Splitting it into Smoke, Regression, and Feature-Specific playlists would let us be more surgical, the immediate win would be a ~2-3 minute smoke suite that runs on every push, not just PR creation.",
    highlights: [
      { value: "4 hrs → 10 min", label: "Critical path validation time" },
      { value: "Manual → Automated", label: "Release regression testing" },
      { value: "Weekly", label: "Scheduled regression runs" },
    ],
  },
  {
    id: "placeholder-two",
    title: "Placeholder case study two",
    summary:
      "A one-line summary of the problem and outcome, shown on the card.",
    tags: ["Placeholder", "Tag"],
    problem:
      "Placeholder — what was broken, missing, or needed, and why it mattered.",
    approach:
      "Placeholder — what was actually built or decided, and the trade-offs weighed along the way.",
    outcome:
      "Placeholder — what changed as a result, ideally with a number attached.",
    futureIterations:
      "Placeholder — what I'd change with hindsight, and what's next if the work continued.",
  },
  {
    id: "placeholder-three",
    title: "Placeholder case study three",
    summary:
      "A one-line summary of the problem and outcome, shown on the card.",
    tags: ["Placeholder", "Tag"],
    problem:
      "Placeholder — what was broken, missing, or needed, and why it mattered.",
    approach:
      "Placeholder — what was actually built or decided, and the trade-offs weighed along the way.",
    outcome:
      "Placeholder — what changed as a result, ideally with a number attached.",
    futureIterations:
      "Placeholder — what I'd change with hindsight, and what's next if the work continued.",
  },
  {
    id: "placeholder-four",
    title: "Placeholder case study four",
    summary:
      "A one-line summary of the problem and outcome, shown on the card.",
    tags: ["Placeholder", "Tag"],
    problem:
      "Placeholder — what was broken, missing, or needed, and why it mattered.",
    approach:
      "Placeholder — what was actually built or decided, and the trade-offs weighed along the way.",
    outcome:
      "Placeholder — what changed as a result, ideally with a number attached.",
    futureIterations:
      "Placeholder — what I'd change with hindsight, and what's next if the work continued.",
  },
] as const;
