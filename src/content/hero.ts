// Hero copy and the "test run" the opener plays and the hero keeps docked.
// Every result line is a verified outcome from experience.ts / caseStudies.ts;
// the per-line durations are flavor for the test-runner format, not claims.

export type RunResult = {
  /** Plain lead-in text. */
  text: string
  /** The key figure, set in bold. */
  strong: string
  /** Display duration for the run line, in milliseconds. */
  ms: number
}

export const hero = {
  lead: {
    before: 'QA Lead & SDET. I walk into teams with ',
    highlight: 'no tests and no process',
    after: ' and leave behind a quality function they own.',
  },
  status: 'Open to QA Lead and SDET roles · San Francisco, Chicago, or remote',
  // James's: shown once a visitor finds the switch by clicking a letter of
  // the name. The hide button's label is Claude's (in COPY.md).
  pickHint: 'You found me :)',
  pickHide: 'Hide',
  run: {
    command: 'npx playwright test james-usher.spec.ts',
    spec: 'james-usher.spec.ts',
    workers: '1 worker',
    results: [
      { text: 'owns quality across ', strong: '8 products', ms: 212 },
      { text: 'automates in ', strong: 'Maestro, Playwright, Cypress', ms: 348 },
      { text: 'critical-path checks ', strong: '4 hrs → 10 min', ms: 401 },
      { text: 'QA support load ', strong: '10 → 2 hrs/wk', ms: 187 },
      { text: 'hires and leads ', strong: 'the team that owns it', ms: 263 },
    ] satisfies RunResult[],
    flaky: 0,
    duration: '1.4s',
  },
} as const

/** The plain-text line the opener types out for each result. */
export function resultLine(result: RunResult): string {
  return result.text + result.strong
}
