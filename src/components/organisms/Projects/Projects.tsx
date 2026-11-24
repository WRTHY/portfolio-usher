import { useEffect, useId, useRef, useState } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import { FaGithub } from 'react-icons/fa6'
import ExpandToggle from '../../atoms/ExpandToggle/ExpandToggle'
import Reveal from '../../atoms/Reveal/Reveal'
import CodePanel from '../../molecules/CodePanel/CodePanel'
import PipelineStages from '../../molecules/PipelineStages/PipelineStages'
import SectionHeader from '../../molecules/SectionHeader/SectionHeader'
import { apiTestingIntro } from '../../../content/apiTesting'
import { codeExamples } from '../../../content/codeExamples'
import { links } from '../../../content/links'
import { getSectionLabel } from '../../../content/navigation'
import { pipeline, pipelineStages, tierOf } from '../../../content/pipeline'
import type { PipelineChoice, StageId } from '../../../content/pipeline'
import { projectsCopy } from '../../../content/projects'
import { testCounts } from '../../../content/testCounts.generated'
import usePrefersReducedMotion from '../../../hooks/usePrefersReducedMotion'
import { isRowToggleClick } from '../../../utils/rowToggle'
import { scrollToTopFollowing } from '../../../utils/scrollToTopFollowing'
import styles from './Projects.module.css'

const sectionLabel = getSectionLabel('projects')

// The two projects, numbered: an index beside the title jumps to either, so
// the second is known about without scrolling to find it.
const projects = [
  { number: '01', id: 'project-site', name: projectsCopy.site.headline },
  { number: '02', id: 'project-api', name: projectsCopy.api.name },
] as const

type Project = (typeof projects)[number]
type ProjectId = Project['id']

// A jump from the index runs while the rows fold and unfold (Reveal's 440ms),
// and a little past it, so it lands on the settled page.
const JUMP_DURATION = 560

// A project's "+": the row's own toggle, a direct child of its article.
const toggleOf = (id: ProjectId) =>
  document.getElementById(id)?.querySelector<HTMLButtonElement>(':scope > button[aria-expanded]')

const examplesFor =(ids: readonly string[]) => codeExamples.filter((example) => ids.includes(example.id))

// Each stage's test count: the sum of the suites it runs.
const stageCounts = Object.fromEntries(
  pipelineStages
    .filter((stage) => stage.counts.length > 0)
    .map((stage) => [
      stage.id,
      stage.counts.reduce((sum, id) => sum + (testCounts.suites.find((suite) => suite.id === id)?.count ?? 0), 0),
    ]),
) as Partial<Record<StageId, number>>

// What the code panel shows for the diagram's choice: the pipeline file, or
// a stage's code, with a line saying where it sits in the run.
const panelFor = (choice: PipelineChoice) => {
  if (choice === 'pipeline') {
    return {
      examples: pipeline.start.examples,
      name: pipeline.start.name,
      note: `Starts every run · calls tiers 1 to ${pipeline.tiers.length}, in order`,
    }
  }
  const stage = pipelineStages.find((item) => item.id === choice)!
  return {
    examples: stage.examples,
    name: stage.name,
    note: `Tier ${tierOf(choice).number} of ${pipeline.tiers.length} · ${stage.workflow}, called by ${pipeline.workflow}`,
  }
}

const apiExamples = codeExamples.filter((example) => example.testingType === 'api')

type ProjectRowProps = {
  project: Project
  open: boolean
  onToggle: () => void
  /** The project's repo, linked beside its name. */
  repo: string
  /** Shown under the name, open or closed. */
  intro: ReactNode
  /** What opening the row shows. */
  children: ReactNode
}

// One project: its number, name and intro, then everything else in a region
// that opens in place, like the ledgers above. A click anywhere on the intro
// opens or closes it too.
function ProjectRow({ project, open, onToggle, repo, intro, children }: ProjectRowProps) {
  const regionId = useId()
  const regionRef = useRef<HTMLDivElement>(null)

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    if (isRowToggleClick(event.target, [regionRef.current])) onToggle()
  }

  return (
    <article id={project.id} className={styles.project} data-testid={project.id} onClick={handleClick}>
      <div className={styles.head}>
        <div className={styles.titleLine}>
          <h3 className={styles.projectName}>
            <span className={styles.number}>{project.number}</span>
            {project.name}
          </h3>
          <a
            className={styles.repoLink}
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${projectsCopy.repoLink}: ${project.name}`}
          >
            <FaGithub aria-hidden="true" />
            {projectsCopy.repoLink}
          </a>
        </div>
        {intro}
      </div>
      <ExpandToggle
        className={styles.toggle}
        expanded={open}
        onToggle={onToggle}
        controls={regionId}
        label={`Open: ${project.name}`}
      />
      <Reveal id={regionId} ref={regionRef} open={open} className={styles.body}>
        {children}
      </Reveal>
    </article>
  )
}

// The page's one violet section, holding two numbered projects. 01 is the
// headline: this site's own testing, told through the CI pipeline it runs
// in (three tiers, cheapest first, each gating the next), which is also the
// way into its code. 02 is a separate suite against a third-party API, not
// part of this site's testing, so it sits apart under its own name.
function Projects() {
  const [choice, setChoice] = useState<PipelineChoice>('e2e')
  const [open, setOpen] = useState<Record<ProjectId, boolean>>({ 'project-site': true, 'project-api': false })
  const stopJump = useRef<() => void>(undefined)
  const prefersReducedMotion = usePrefersReducedMotion()
  const panel = panelFor(choice)

  useEffect(() => () => stopJump.current?.(), [])

  const toggle = (id: ProjectId) => setOpen((current) => ({ ...current, [id]: !current[id] }))

  // The index opens only the project it names, folding the other away, and
  // brings it to the top of the page. Focus moves to its "+", so the
  // keyboard carries on from there.
  const jumpTo = (event: MouseEvent<HTMLAnchorElement>, id: ProjectId) => {
    event.preventDefault()
    setOpen(Object.fromEntries(projects.map((project) => [project.id, project.id === id])) as Record<ProjectId, boolean>)
    const element = document.getElementById(id)
    if (!element) return
    // The other projects' opened regions, which are about to fold away.
    const folding = projects
      .filter((project) => project.id !== id && open[project.id])
      .map((project) => document.getElementById(toggleOf(project.id)?.getAttribute('aria-controls') ?? ''))
      .filter((region) => region !== null)
    toggleOf(id)?.focus({ preventScroll: true })
    stopJump.current?.()
    stopJump.current = scrollToTopFollowing(element, {
      duration: JUMP_DURATION,
      reducedMotion: prefersReducedMotion,
      folding,
    })
  }

  const rowProps = (project: Project) => ({
    project,
    open: open[project.id],
    onToggle: () => toggle(project.id),
  })

  const [site, api] = projects

  const index = (
    <ol className={styles.index} aria-label="Projects in this section">
      {projects.map((project) => (
        <li key={project.id}>
          <a href={`#${project.id}`} onClick={(event) => jumpTo(event, project.id)}>
            <span className={styles.number}>{project.number}</span>
            {project.name}
          </a>
        </li>
      ))}
    </ol>
  )

  return (
    // data-surface marks it for fixed chrome passing over it (the left rail),
    // which switches to the violet field's colours here.
    <section id="projects" className={styles.projects} aria-labelledby="projects-heading" data-surface="accent">
      <div className={styles.onField}>
        <SectionHeader id="projects-heading" title={sectionLabel} count={projects.length} aside={index} />

        <ProjectRow
          {...rowProps(site)}
          repo={links.portfolioRepo}
          intro={<p className={styles.description}>{projectsCopy.site.description}</p>}
        >
          <div className={styles.siteInner}>
            <PipelineStages
              label={projectsCopy.site.pipelineLabel}
              start={pipeline.start}
              tiers={pipeline.tiers}
              counts={stageCounts}
              value={choice}
              onChange={setChoice}
            />

            <CodePanel
              className={styles.page}
              key={choice}
              examples={examplesFor(panel.examples)}
              frameworkLabel={`${panel.name} framework`}
              note={panel.note}
            />
          </div>
        </ProjectRow>

        <ProjectRow
          {...rowProps(api)}
          repo={links.apiTestingRepo}
          intro={<p className={styles.apiSummary}>{projectsCopy.api.summary}</p>}>
          <div className={styles.apiInner}>
            <p className={styles.apiStory}>{apiTestingIntro}</p>
            <CodePanel className={styles.page} examples={apiExamples} frameworkLabel="API tool" />
          </div>
        </ProjectRow>
      </div>
    </section>
  )
}

export default Projects
