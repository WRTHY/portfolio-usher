import { describe, expect, it } from 'vitest'
import { codeExamples } from './codeExamples'
import { pipeline, pipelineStages } from './pipeline'
import { testCounts } from './testCounts.generated'

// The real CI config, loaded by path.
const files = import.meta.glob<string>('/.github/workflows/*.yml', {
  query: '?raw',
  import: 'default',
  eager: true,
})
const workflow = (file: string) => files[`/.github/workflows/${file}`]?.replace(/\r\n/g, '\n') ?? ''

// Just enough of a workflow's structure to check the diagram against: its
// triggers, and each job's block of lines, display name, needs and uses.
type Job = { name: string; needs: string[]; uses: string; block: string }
function parse(yaml: string) {
  const triggers = [...(yaml.match(/^on:\n((?: {2}.*\n)*)/m)?.[1] ?? '').matchAll(/^ {2}([a-z_]+):/gm)].map((m) => m[1])
  const jobs = new Map<string, Job>()
  const section = yaml.slice(yaml.indexOf('\njobs:\n'))
  for (const [, id, block] of section.matchAll(/^ {2}([a-z0-9-]+):\n((?: {4}.*\n|\s*\n|\s*#.*\n)*)/gm)) {
    jobs.set(id, {
      name: block.match(/^ {4}name: (.+)$/m)?.[1] ?? '',
      needs: (block.match(/^ {4}needs: \[(.*)\]$/m)?.[1] ?? '').split(',').map((need) => need.trim()).filter(Boolean),
      uses: block.match(/^ {4}uses: (.+)$/m)?.[1] ?? '',
      block,
    })
  }
  return { triggers, jobs }
}

const ci = parse(workflow(pipeline.workflow))

// The pipeline diagram on the page states facts about this repo's CI. These
// hold it to them, so a renamed job, a dropped dependency or a new workflow
// fails here instead of leaving the page claiming something CI doesn't do.
describe('pipeline', () => {
  it('runs ci.yml on every pull request and every push to master', () => {
    expect(workflow(pipeline.workflow)).toMatch(/^on:\n {2}push:\n {4}branches:\n {6}- master\n {2}pull_request:/m)
  })

  it('has a stage for every workflow ci.yml calls, and calls nothing else', () => {
    const called = [...ci.jobs.values()].map((job) => job.uses).sort()
    expect(called).toEqual(pipelineStages.map((stage) => `./.github/workflows/${stage.workflow}`).sort())
    pipelineStages.forEach((stage) => {
      expect(ci.jobs.get(stage.ciJob)?.uses, stage.name).toBe(`./.github/workflows/${stage.workflow}`)
    })
  })

  it('leaves the stage workflows to ci.yml, but runnable on their own', () => {
    const other = Object.keys(files).map((path) => path.split('/').pop()).filter((file) => file !== pipeline.workflow)
    expect(other.sort()).toEqual(pipelineStages.map((stage) => stage.workflow).sort())
    pipelineStages.forEach((stage) => {
      // Called by ci.yml, and by hand from the Actions tab; never on a push
      // or pull request of its own, so nothing runs twice.
      expect(parse(workflow(stage.workflow)).triggers.sort(), stage.workflow).toEqual(['workflow_call', 'workflow_dispatch'])
    })
  })

  it('gates each tier on every stage in the tier before it, and the first tier on nothing', () => {
    pipeline.tiers.forEach((tier, index) => {
      const before = index === 0 ? [] : pipeline.tiers[index - 1].stages.map((stage) => stage.ciJob)
      tier.stages.forEach((stage) => {
        expect(ci.jobs.get(stage.ciJob)?.needs.sort(), `${stage.ciJob} needs`).toEqual([...before].sort())
      })
    })
  })

  it("names each stage's jobs as its workflow does", () => {
    pipelineStages.forEach((stage) => {
      const names = [...parse(workflow(stage.workflow)).jobs.values()].map((job) => job.name)
      expect(names.sort(), stage.workflow).toEqual([...stage.jobs].sort())
    })
  })

  it('keeps artifacts exactly where its workflows upload them', () => {
    pipelineStages.forEach((stage) => {
      expect(workflow(stage.workflow).includes('actions/upload-artifact'), stage.name).toBe(Boolean(stage.keeps))
    })
  })

  it('opens the pipeline file from its first node, and each stage ends on the workflow it runs', () => {
    const lastFile = (ids: readonly string[]) =>
      codeExamples.filter((example) => ids.includes(example.id)).map((example) => example.files.at(-1)?.filename)
    expect(lastFile(pipeline.start.examples)).toEqual([`.github/workflows/${pipeline.workflow}`])
    pipelineStages.forEach((stage) => {
      lastFile(stage.examples).forEach((file) => expect(file, stage.name).toBe(`.github/workflows/${stage.workflow}`))
    })
  })

  it('opens real code examples, and counts real suites', () => {
    const exampleIds = codeExamples.map((example) => example.id)
    const suiteIds = testCounts.suites.map((suite) => suite.id)
    expect(pipeline.start.examples.length).toBeGreaterThan(0)
    pipeline.start.examples.forEach((id) => expect(exampleIds).toContain(id))
    pipelineStages.forEach((stage) => {
      expect(stage.examples.length, stage.name).toBeGreaterThan(0)
      stage.examples.forEach((id) => expect(exampleIds).toContain(id))
      stage.counts.forEach((id) => expect(suiteIds).toContain(id))
    })
  })
})
