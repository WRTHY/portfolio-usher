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

/** A piece of the pitch; marked pieces get the highlighter. */
export type LeadPart = { text: string; mark?: boolean }

export const hero = {
  lead: [
    { text: 'Startup QA Lead & SDET. ' },
    { text: 'Quality', mark: true },
    { text: ' wrought from ' },
    { text: 'Chaos', mark: true },
    { text: ' through ' },
    { text: 'Consistency', mark: true },
    { text: '.' },
  ] satisfies LeadPart[],
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
      { text: 'owns Quality across ', strong: 'the entire engineering org', ms: 212 },
      { text: 'architects automation in ', strong: 'Maestro, Playwright, Cypress', ms: 348 },
      { text: 'tests critical user flows ', strong: 'in a 20th of the time', ms: 401 },
      { text: 'drives initiatives that lift ', strong: 'cross-team performance', ms: 187 },
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
