import { Fragment, useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { getSectionLabel } from '../../../content/navigation'
import { education, experience, experienceIntro, remainingStack } from '../../../content/experience'
import type { EducationEntry, ExperienceEntry } from '../../../content/experience'
import Heading from '../../atoms/Heading/Heading'
import ExpandToggle from '../../atoms/ExpandToggle/ExpandToggle'
import Reveal from '../../atoms/Reveal/Reveal'
import { isRowToggleClick } from '../../../utils/rowToggle'
import SectionHeader from '../../molecules/SectionHeader/SectionHeader'
import CareerGraph from '../../molecules/CareerGraph/CareerGraph'
import type { CareerGraphNode } from '../../molecules/CareerGraph/CareerGraph'
import { cx } from '../../../utils/classNames'
import styles from './Experience.module.css'

const sectionLabel = getSectionLabel('experience')

type ExperienceRowProps = {
  entry: ExperienceEntry
  open: boolean
  onToggle: () => void
  highlighted: boolean
  /** The row is under the pointer, or its "+" has keyboard focus. */
  onHighlightChange: (highlighted: boolean) => void
}

// One ledger row. Collapsed it reads dates · role and company · the
// one-sentence impact · up to four tools; the "+" unfolds the detail
// bullets and the rest of the role's stack together, in place.
function ExperienceRow({ entry, open, onToggle, highlighted, onHighlightChange }: ExperienceRowProps) {
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
      className={cx(styles.row, open && styles.open, highlighted && styles.highlighted)}
      data-testid={`experience-${entry.id}`}
      data-highlighted={highlighted || undefined}
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
function EducationRow({ entry }: { entry: EducationEntry }) {
  return (
    <li className={cx(styles.row, styles.education)} data-testid={`education-${entry.id}`}>
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
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set())
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [layout, setLayout] = useState<GraphLayout>({ ys: [], height: 0 })
  const frameRef = useRef<HTMLDivElement>(null)

  // Node positions come from the rendered rows, re-measured whenever the
  // ledger resizes (a row opening, fonts loading, the window changing), so
  // the graph always lines up with the dates it marks.
  useEffect(() => {
    const frame = frameRef.current
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
  }, [])

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  // One node per ledger row: each role, then the degree at the root.
  const nodeIds = [...experience.map((entry) => entry.id), education.id]
  const nodes: CareerGraphNode[] =
    layout.ys.length === nodeIds.length
      ? nodeIds.map((id, i) => ({
          id,
          y: layout.ys[i],
          active: openIds.has(id),
          highlighted: highlightedId === id,
        }))
      : []

  return (
    <section id="experience" aria-labelledby="experience-heading">
      <SectionHeader id="experience-heading" title={sectionLabel} intro={experienceIntro} />
      <div ref={frameRef} className={styles.ledgerFrame}>
        <CareerGraph className={styles.graph} nodes={nodes} height={layout.height} />
        <ol className={styles.ledger}>
          {experience.map((entry) => (
            <ExperienceRow
              key={entry.id}
              entry={entry}
              open={openIds.has(entry.id)}
              onToggle={() => toggle(entry.id)}
              highlighted={highlightedId === entry.id}
              onHighlightChange={(highlighted) =>
                setHighlightedId((current) => (highlighted ? entry.id : current === entry.id ? null : current))
              }
            />
          ))}
          <EducationRow entry={education} />
        </ol>
      </div>
    </section>
  )
}

export default Experience
