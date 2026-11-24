// The Projects section's pipeline: how this site's tests are layered, and
// how CI runs them. .github/workflows/ci.yml is the pipeline: it runs on
// every pull request and push to master and calls one reusable workflow per
// stage, in three tiers, cheapest first. A tier starts only once everything
// before it has passed; the stages in a tier run in parallel. Every fact
// here is checked against the workflow files (see pipeline.test.ts), so the
// diagram can't drift from what CI does.
//
// The wording of the labels is Claude's (listed in the local COPY.md).

export type StageId = 'static' | 'unit' | 'component' | 'e2e'

/** What the diagram can show: the pipeline itself (ci.yml), or a stage. */
export type PipelineChoice = 'pipeline' | StageId

/** The diagram's first node: ci.yml, which starts every run. */
export type PipelineStart = {
  /** Above its card, where a tier has its number and name. */
  label: string
  name: string
  tools: string
  /** The code example it opens: the pipeline file. */
  examples: readonly string[]
}

export type PipelineStage = {
  id: StageId
  name: string
  /** The tools that run in it, briefly. */
  tools: string
  /** Its job in ci.yml, which calls `workflow`. */
  ciJob: string
  /** The reusable workflow it runs, in .github/workflows/. */
  workflow: string
  /** That workflow's jobs, by display name (`name:`), as CI's checks show them. */
  jobs: readonly string[]
  /** What CI keeps from a run, if anything. */
  keeps?: string
  /** The code examples it opens (codeExamples.ts ids). */
  examples: readonly string[]
  /** Its suites in testCounts.generated.ts, for the small count on its card. */
  counts: readonly string[]
}

export type PipelineTier = {
  /** 1, 2, 3: the order they run in, left to right on the page. */
  number: number
  name: string
  stages: readonly PipelineStage[]
}

export type Pipeline = {
  /** The pipeline's own workflow, in .github/workflows/. */
  workflow: string
  /** The branch pushes run CI on. */
  branch: string
  start: PipelineStart
  tiers: readonly PipelineTier[]
}

export const pipeline: Pipeline = {
  workflow: 'ci.yml',
  branch: 'master',
  start: {
    label: 'Pipeline',
    name: 'ci.yml',
    tools: 'Runs each tier in turn',
    examples: ['ci-pipeline'],
  },
  tiers: [
    {
      number: 1,
      name: 'Static checks',
      stages: [
        {
          id: 'static',
          name: 'Lint, types, build',
          tools: 'ESLint · TypeScript · Vite',
          ciJob: 'static-checks',
          workflow: 'lint-and-build.yml',
          jobs: ['ESLint & TypeScript', 'Vite Production Build'],
          examples: ['static-checks'],
          counts: [],
        },
      ],
    },
    {
      number: 2,
      name: 'Fast tests',
      stages: [
        {
          id: 'unit',
          name: 'Unit',
          tools: 'Vitest + Testing Library, in jsdom',
          ciJob: 'unit',
          workflow: 'unit-tests.yml',
          jobs: ['Vitest'],
          examples: ['vitest-component-tests'],
          counts: ['vitest'],
        },
        {
          id: 'component',
          name: 'Component',
          tools: 'Cypress, in a real browser',
          ciJob: 'component',
          workflow: 'component-tests.yml',
          jobs: ['Cypress'],
          keeps: 'screenshots of any failure',
          examples: ['cypress-ct-component-tests'],
          counts: ['cypress-component'],
        },
      ],
    },
    {
      number: 3,
      name: 'End-to-end',
      stages: [
        {
          id: 'e2e',
          name: 'End-to-end',
          tools: 'Playwright + Cypress, with axe',
          ciJob: 'e2e',
          workflow: 'e2e-tests.yml',
          jobs: ['Playwright', 'Cypress'],
          keeps: "Playwright's report every run, Cypress screenshots of any failure",
          examples: ['playwright-case-studies', 'cypress-case-studies'],
          counts: ['playwright', 'cypress-e2e'],
        },
      ],
    },
  ],
}

export const pipelineStages: readonly PipelineStage[] = pipeline.tiers.flatMap((tier) => tier.stages)

export const tierOf = (stage: StageId): PipelineTier =>
  pipeline.tiers.find((tier) => tier.stages.some((item) => item.id === stage))!
