export type CaseStudy = {
  id: string
  title: string
  summary: string
  tags: readonly string[]
  problem: string
  approach: string
  outcome: string
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
      'Placeholder — what was actually built or decided, and the trade-offs weighed along the way.',
    futureIterations:
      'Placeholder — what a follow-up pass would tackle next, if the scope were extended.',
    outcome: 'Placeholder — what changed as a result, ideally with a number attached.',
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
      'Placeholder — what was actually built or decided, and the trade-offs weighed along the way.',
    outcome: 'Placeholder — what changed as a result, ideally with a number attached.',
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
      'Placeholder — what was actually built or decided, and the trade-offs weighed along the way.',
    outcome: 'Placeholder — what changed as a result, ideally with a number attached.',
  },
] as const;
