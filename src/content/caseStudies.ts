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
}

export const caseStudies: readonly CaseStudy[] = [
  {
    id: "CS 1",
    title: `Building E2E Test Automation From Zero for Eventric's Flagship Desktop App`,
    summary:
      "Master Tour Desktop is an Electron desktop app backed by a local SQLite database that had no existing E2E coverage. As QA Lead, I owned building that test coverage from the ground up.",
    tags: ["Automation", "Playwright", "React"],
    problem: "Testing on the main desktop product for Eventric was slow and inconsistent. All testing was manual and required significant setup time. As we moved towards faster releases, we needed a better way to test the app.",
    approach:
      "A PRD was written and shared with engineering management detailing the approach. Electron + local SQLite means tests can't safely run in parallel — multiple workers hitting the same local DB causes data collisions. Rather than fight that, I designed the suite to run serially and built the framework around it: a shared authenticated-session fixture (avoiding repeated logins from a cold Electron start), a centralized navigation helper, and a page-object layer scaffolded for every major app section up front. I sequenced test-writing by business value - critical daily workflows first, edge cases last - so the team had usable CI coverage early rather than needing months before anything worked",
    outcome:
      "Framework foundations and the highest-value test tier shipped first and became the base every later suite was built on. Zero E2E coverage to an actively growing, CI-integrated regression suite, without ever hitting the parallelization/data-collision trap. Regression testing on release candidates went from a fully manual regressionprocess to an automated process with minor spot checks on feature specific changes",
    futureIterations:
      "Communication of test results remained a major pain point of this work. In future iterations, i would have liked to explore a way to log test results immediately on the PR that the pipeline is run on. Additionally, a slack output channel could have been a useful place to notify the team of any failures or regressions immediately and without QA needing to manually check the results.",
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
