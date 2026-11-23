import { useId, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import { getSectionLabel } from '../../../content/navigation'
import { caseStudies } from '../../../content/caseStudies'
import type { CaseStudy } from '../../../content/caseStudies'
import ExpandToggle from '../../atoms/ExpandToggle/ExpandToggle'
import Heading from '../../atoms/Heading/Heading'
import Reveal from '../../atoms/Reveal/Reveal'
import SectionHeader from '../../molecules/SectionHeader/SectionHeader'
import { sortBySkillOrder } from '../../molecules/SkillsAndTools/skillColorway'
import usePrefersReducedMotion from '../../../hooks/usePrefersReducedMotion'
import { cx } from '../../../utils/classNames'
import { isRowToggleClick } from '../../../utils/rowToggle'
import styles from './CaseStudies.module.css'

const sectionLabel = getSectionLabel('case-studies')

// The write-up's parts, in reading order. Future iterations is optional.
const PARTS = [
  { key: 'problem', label: 'Problem' },
  { key: 'approach', label: 'Approach' },
  { key: 'outcome', label: 'Outcome' },
  { key: 'futureIterations', label: 'Future iterations' },
] as const

// Content fields are plain strings with blank-line-separated paragraphs.
// A single <p> collapses those newlines like any other HTML whitespace, so
// split on them explicitly and render one <p> per paragraph instead.
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
    </>
  )
}

type CaseStudyRowProps = {
  caseStudy: CaseStudy
  open: boolean
  onToggle: () => void
}

// One row, led by its outcome: the headline figure and what it measures,
// then the title and its topics. The "+" (or a click anywhere on the row)
// unfolds the full write-up in place, with any other figures beside it.
function CaseStudyRow({ caseStudy, open, onToggle }: CaseStudyRowProps) {
  const [highlighted, setHighlighted] = useState(false)
  const titleId = useId()
  const writeUpId = useId()
  const figuresId = useId()
  const writeUpRef = useRef<HTMLDivElement>(null)
  const figuresRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const rowRef = useRef<HTMLLIElement>(null)
  const prefersReducedMotion = usePrefersReducedMotion()

  const [headline, ...figures] = caseStudy.highlights
  const parts = PARTS.filter(({ key }) => caseStudy[key])
  const controls = figures.length > 0 ? `${writeUpId} ${figuresId}` : writeUpId

  const handleRowClick = (event: MouseEvent<HTMLLIElement>) => {
    if (isRowToggleClick(event.target, [writeUpRef.current, figuresRef.current])) onToggle()
  }

  // The write-ups are long, so there's a way to close one from its end. It
  // hands focus back to the "+" and, if the row's top has scrolled away,
  // brings it back into view, so the reader lands where the case study began.
  const closeFromEnd = () => {
    onToggle()
    toggleRef.current?.focus({ preventScroll: true })
    const row = rowRef.current
    if (row && row.getBoundingClientRect().top < 0) {
      row.scrollIntoView({ block: 'start', behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
  }

  return (
    <li
      ref={rowRef}
      className={cx(styles.row, highlighted && styles.highlighted)}
      data-testid={`case-study-${caseStudy.id}`}
      data-highlighted={highlighted || undefined}
      onClick={handleRowClick}
      onPointerEnter={(event) => event.pointerType !== 'touch' && setHighlighted(true)}
      onPointerLeave={() => setHighlighted(false)}
    >
      <p className={styles.headline}>
        <span className={styles.headlineValue}>{headline.value}</span>
        <span className={styles.headlineLabel}>{headline.label}</span>
      </p>
      <Heading level={3} id={titleId} className={styles.title}>
        {caseStudy.title}
      </Heading>
      <ul className={styles.tags} aria-label={`Topics: ${caseStudy.title}`}>
        {sortBySkillOrder(caseStudy.tags).map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <ExpandToggle
        ref={toggleRef}
        className={styles.toggle}
        expanded={open}
        onToggle={onToggle}
        controls={controls}
        label={`Read case study: ${caseStudy.title}`}
        onFocus={(event) => event.currentTarget.matches(':focus-visible') && setHighlighted(true)}
        onBlur={() => setHighlighted(false)}
      />
      {figures.length > 0 && (
        <Reveal id={figuresId} ref={figuresRef} open={open} className={styles.figures}>
          <dl aria-label={`More results: ${caseStudy.title}`}>
            {figures.map(({ value, label }) => (
              <div key={label} className={styles.figure}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      )}
      <Reveal id={writeUpId} ref={writeUpRef} open={open} className={styles.writeUp}>
        <article aria-labelledby={titleId} data-testid={`case-study-write-up-${caseStudy.id}`}>
          <p className={styles.summary}>{caseStudy.summary}</p>
          {caseStudy.phases && caseStudy.phases.length > 0 && (
            <div className={styles.phases}>
              <h4 id={`${titleId}-phases`}>The framework, phase by phase</h4>
              <ol aria-labelledby={`${titleId}-phases`}>
                {caseStudy.phases.map((phase) => (
                  <li key={phase.name}>
                    <span className={styles.phaseName}>{phase.name}</span>
                    <span className={styles.phaseTime}>{phase.timeframe}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {parts.map(({ key, label }) => (
            <section
              key={key}
              className={cx(styles.part, key === 'futureIterations' && styles.reflection)}
              aria-labelledby={`${titleId}-${key}`}
              data-testid={`case-study-part-${key}`}
            >
              <h4 id={`${titleId}-${key}`}>{label}</h4>
              <Paragraphs text={caseStudy[key] ?? ''} />
            </section>
          ))}
          <button type="button" className={styles.closeFromEnd} onClick={closeFromEnd}>
            Close case study
          </button>
        </article>
      </Reveal>
    </li>
  )
}

// Outcome-led rows, one per case study, each opening in place: no modal,
// no second scroll container, and the page's own scroll and back button
// keep working while a case study is open.
function CaseStudies() {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(() => new Set())

  const toggle = (id: string) =>
    setOpenIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })

  return (
    <section id="case-studies" aria-labelledby="case-studies-heading">
      <SectionHeader id="case-studies-heading" title={sectionLabel} />
      <ol className={styles.ledger}>
        {caseStudies.map((caseStudy) => (
          <CaseStudyRow
            key={caseStudy.id}
            caseStudy={caseStudy}
            open={openIds.has(caseStudy.id)}
            onToggle={() => toggle(caseStudy.id)}
          />
        ))}
      </ol>
    </section>
  )
}

export default CaseStudies
