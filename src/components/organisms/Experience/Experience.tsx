import { Fragment, useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { getSectionLabel } from '../../../content/navigation'
import {
  education,
  experience,
  experienceIntro,
  remainingStack,
  skillsHeading,
  skillsHint,
  skillsInProjects,
} from '../../../content/experience'
import { projectTools } from '../../../content/projects'
import type { EducationEntry, ExperienceEntry } from '../../../content/experience'
import Heading from '../../atoms/Heading/Heading'
import ExpandToggle from '../../atoms/ExpandToggle/ExpandToggle'
import Reveal from '../../atoms/Reveal/Reveal'
import { useAccordion } from '../../../hooks/useAccordion'
import { isRowToggleClick } from '../../../utils/rowToggle'
import { navHeight } from '../../../utils/navHeight'
import SectionHeader from '../../molecules/SectionHeader/SectionHeader'
import CareerGraph from '../../molecules/CareerGraph/CareerGraph'
import SkillsAndTools from '../../molecules/SkillsAndTools/SkillsAndTools'
import { gridToolsIn } from '../../molecules/SkillsAndTools/skillColorway'
import type { CareerGraphNode } from '../../molecules/CareerGraph/CareerGraph'
import { cx } from '../../../utils/classNames'
import styles from './Experience.module.css'

const sectionLabel = getSectionLabel('experience')

// Every Skills & tools grid tool a role used, from its key tools ('Jest +
// RNTL' stands for two) and its stack.
const gridToolsOf = (entry: ExperienceEntry) =>
  new Set(
    [...entry.keyTools.flatMap(({ tool, covers }) => covers ?? [tool]), ...(entry.stack ?? [])].flatMap(gridToolsIn),
  )

// Both come from static content, so they're worked out once, not per render.
const toolsByRole = new Map(experience.map((entry) => [entry.id, gridToolsOf(entry)]))
const usedTools = new Set([...[...toolsByRole.values()].flatMap((tools) => [...tools]), ...projectTools])

type ExperienceRowProps = {
  entry: ExperienceEntry
  open: boolean
  onToggle: () => void
  highlighted: boolean
  /** The row is under the pointer, or its "+" has keyboard focus. */
  onHighlightChange: (highlighted: boolean) => void
  /** Whether this role used that tool; undefined while nothing is chosen. */
  matches?: boolean
}

// One ledger row. Collapsed it reads dates · role and company · the
// one-sentence impact · up to four tools; the "+" unfolds the detail
// bullets and the rest of the role's stack together, in place.
function ExperienceRow({
  entry,
  open,
  onToggle,
  highlighted,
  onHighlightChange,
  matches,
}: ExperienceRowProps) {
  const detailsId = useId()
  const moreId = useId()
  const detailsRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const moreTools = remainingStack(entry)
  const hasTools = entry.keyTools.length > 0 || moreTools.length > 0

  // The whole row opens it, not only the "+" (see isRowToggleClick).
  const handleRowClick = (event: MouseEvent<HTMLLIElement>) => {
    if (isRowToggleClick(event.target, [detailsRef.current, moreRef.current])) onToggle()
  }

  return (
    <li
      className={cx(styles.row, open && styles.open, highlighted && styles.highlighted, matches === false && styles.miss)}
      data-testid={`experience-${entry.id}`}
      data-accordion-row={entry.id}
      data-highlighted={highlighted || undefined}
      data-tool-match={matches}
      onClick={handleRowClick}
      onPointerEnter={(event) => event.pointerType !== 'touch' && onHighlightChange(true)}
      onPointerLeave={() => onHighlightChange(false)}
    >
      {/* The git-graph rail puts this role's node level with its dates. */}
      <p className={styles.dates} data-graph-anchor>
        {entry.dates}
      </p>
      <div className={styles.role}>
        <Heading level={3}>{entry.role}</Heading>
        <a className={styles.company} href={entry.companyUrl} target="_blank" rel="noopener noreferrer">
          {entry.company}
        </a>
      </div>
      <p className={styles.impact}>{entry.impact}</p>
      {hasTools && (
        <div className={styles.tools}>
          {entry.keyTools.length > 0 && (
            // Each framework with what it tested: the column answers "what
            // did you automate, and at which layer", not a loose list of logos.
            <ul className={styles.keyTools} aria-label={`Key tools as ${entry.role}`}>
              {entry.keyTools.map(({ tool, scope }) => (
                <li key={tool}>
                  <span className={styles.tool}>{tool}</span>
                  <span className={styles.scope}>{scope}</span>
                </li>
              ))}
            </ul>
          )}
          {moreTools.length > 0 && (
            // Opening the role grows this column into the full stack: the
            // key tools stay put and the rest unfolds beneath them.
            <Reveal id={moreId} ref={moreRef} open={open}>
              <div className={styles.moreBody}>
                  <p className={styles.moreLabel} aria-hidden="true">
                    Also in the stack
                  </p>
                  <ul className={styles.more} aria-label={`More tools as ${entry.role}`}>
                    {moreTools.map((tool, i) => (
                      <li key={tool} style={{ '--i': i } as CSSProperties}>
                        {/* "TypeScript/JavaScript" may wrap after its slash
                            in a narrow column, rather than being clipped. */}
                        {tool.split('/').map((part, j) => (
                          <Fragment key={part}>
                            {j > 0 && (
                              <>
                                /<wbr />
                              </>
                            )}
                            {part}
                          </Fragment>
                        ))}
                      </li>
                    ))}
                  </ul>
              </div>
            </Reveal>
          )}
        </div>
      )}
      <ExpandToggle
        className={styles.toggle}
        expanded={open}
        onToggle={onToggle}
        controls={moreTools.length > 0 ? `${detailsId} ${moreId}` : detailsId}
        label={`Details: ${entry.role}`}
        onFocus={(event) => event.currentTarget.matches(':focus-visible') && onHighlightChange(true)}
        onBlur={() => onHighlightChange(false)}
      />
      <Reveal id={detailsId} ref={detailsRef} open={open} className={styles.details}>
        <ul className={styles.points} aria-label={`What I did as ${entry.role}`}>
          {entry.details.map((detail) => (
            <li key={detail}>{detail}</li>
          ))}
        </ul>
      </Reveal>
    </li>
  )
}

// The ledger's last row: the degree, where the career (and the git-graph)
// starts. Nothing to open, so no "+" and no row click.
function EducationRow({ entry, faded }: { entry: EducationEntry; faded: boolean }) {
  return (
    <li className={cx(styles.row, styles.education, faded && styles.miss)} data-testid={`education-${entry.id}`}>
      <p className={styles.dates} data-graph-anchor>
        {entry.dates}
      </p>
      <div className={styles.role}>
        <Heading level={3}>{entry.degree}</Heading>
        <a className={styles.company} href={entry.schoolUrl} target="_blank" rel="noopener noreferrer">
          {entry.school}
        </a>
      </div>
    </li>
  )
}

type GraphLayout = { ys: readonly number[]; height: number }

// A ledger, not cards: one row per role, newest first, so the whole career
// scans in a few seconds and each role opens up on demand. A git-graph rail
// runs down its left edge (see CareerGraph): a role's node is lit while the
// role is open. None is lit by default, since no role is a current one.
function Experience() {
  const { openId, toggle, scopeRef } = useAccordion<HTMLDivElement>()
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  // The Skills & tools filter: a tool previewed (pointer or keyboard) wins
  // over one picked (click or tap), which stays until cleared.
  const [previewTool, setPreviewTool] = useState<string | null>(null)
  const [pickedTool, setPickedTool] = useState<string | null>(null)
  const activeTool = previewTool ?? pickedTool
  const sectionRef = useRef<HTMLElement>(null)

  // Leaving the section, by scrolling or by a link, clears the filter, so
  // coming back finds the whole ledger again. The band below the top bar is
  // the visible page.
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) return
        setPickedTool(null)
        setPreviewTool(null)
      },
      { rootMargin: `-${navHeight()}px 0px 0px 0px` },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])
  const matchesTool = (id: string) => (activeTool === null ? undefined : toolsByRole.get(id)?.has(activeTool))
  const rolesWithTool = experience.filter((entry) => matchesTool(entry.id))
  const inProjects = activeTool !== null && projectTools.includes(activeTool)
  const [layout, setLayout] = useState<GraphLayout>({ ys: [], height: 0 })

  // Node positions come from the rendered rows, re-measured whenever the
  // ledger resizes (a row opening, fonts loading, the window changing), so
  // the graph always lines up with the dates it marks.
  useEffect(() => {
    const frame = scopeRef.current
    if (!frame) return
    const measure = () => {
      const top = frame.getBoundingClientRect().top
      const ys = [...frame.querySelectorAll<HTMLElement>('[data-graph-anchor]')].map((anchor) => {
        const rect = anchor.getBoundingClientRect()
        // Exact, not rounded: layout lands on fractional pixels, and
        // rounding here put nodes up to a pixel off their dates.
        return rect.top - top + rect.height / 2
      })
      // Committed in the same frame it was measured in: while a role folds
      // open the rows move every frame, and a normal (deferred) update left
      // the nodes trailing their dates by a frame.
      flushSync(() => setLayout({ ys, height: frame.offsetHeight }))
    }
    const observer = new ResizeObserver(measure)
    observer.observe(frame)
    return () => observer.disconnect()
  }, [scopeRef])

  // One node per ledger row: each role, then the degree at the root.
  const nodeIds = [...experience.map((entry) => entry.id), education.id]
  const nodes: CareerGraphNode[] =
    layout.ys.length === nodeIds.length
      ? nodeIds.map((id, i) => ({
          id,
          y: layout.ys[i],
          active: openId === id,
          highlighted: highlightedId === id || matchesTool(id) === true,
        }))
      : []

  return (
    <section id="experience" ref={sectionRef} aria-labelledby="experience-heading">
      <SectionHeader id="experience-heading" title={sectionLabel} intro={experienceIntro} />
      {/* Every tool across the roles below, which also filters them. */}
      <div className={styles.skills}>
        <Heading level={3} className={styles.srOnly}>
          {skillsHeading}
        </Heading>
        <SkillsAndTools
          usedTools={usedTools}
          active={activeTool}
          picked={pickedTool}
          onPreview={setPreviewTool}
          onPick={setPickedTool}
        />
        <p className={styles.skillsStatus} aria-live="polite" data-testid="skills-status">
          {activeTool ? (
            <>
              <strong>{activeTool}</strong>: {rolesWithTool.map((entry) => entry.role).join(' · ')}
              {inProjects && (
                <>
                  {rolesWithTool.length > 0 ? ' · ' : `${skillsInProjects.alone} `}
                  <a className={styles.skillsLink} href="#projects">
                    {skillsInProjects.link}
                  </a>
                </>
              )}
            </>
          ) : (
            skillsHint
          )}
        </p>
      </div>
      <div ref={scopeRef} className={styles.ledgerFrame}>
        <CareerGraph className={styles.graph} nodes={nodes} height={layout.height} />
        <ol className={styles.ledger}>
          {experience.map((entry) => (
            <ExperienceRow
              key={entry.id}
              entry={entry}
              open={openId === entry.id}
              onToggle={() => toggle(entry.id)}
              highlighted={highlightedId === entry.id}
              onHighlightChange={(highlighted) =>
                setHighlightedId((current) => (highlighted ? entry.id : current === entry.id ? null : current))
              }
              matches={matchesTool(entry.id)}
            />
          ))}
          <EducationRow entry={education} faded={activeTool !== null} />
        </ol>
      </div>
    </section>
  )
}

export default Experience
