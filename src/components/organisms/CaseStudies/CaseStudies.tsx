import { useEffect, useId, useRef, useState } from 'react'
import { sections } from '../../../content/navigation'
import Badge from '../../atoms/Badge/Badge'
import Heading from '../../atoms/Heading/Heading'
import Modal from '../../molecules/Modal/Modal'
import ParticleBackground from '../../molecules/ParticleBackground/ParticleBackground'
import { caseStudies } from '../../../content/caseStudies'
import type { CaseStudy } from '../../../content/caseStudies'
import styles from './CaseStudies.module.css'

const sectionLabel = sections.find((section) => section.id === 'case-studies')!.label

type ReportSection = {
  key: 'problem' | 'approach' | 'outcome'| 'futureIterations'
  label: string
}

// Content fields are plain strings with blank-line-separated paragraphs
// (see futureIterations in caseStudies.ts). A single <p> collapses those
// newlines like any other HTML whitespace, so split on them explicitly
// and render one <p> per paragraph instead.
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text
        .split(/\n\s*\n+/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean)
        .map((paragraph, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <p key={index}>{paragraph}</p>
        ))}
    </>
  )
}

function reportSectionsFor(caseStudy: CaseStudy): ReportSection[] {
  return [
    { key: 'problem', label: 'Problem' },
    { key: 'approach', label: 'Approach' },
    { key: 'outcome', label: 'Outcome' },
    ...(caseStudy.futureIterations
      ? [{ key: 'futureIterations' as const, label: 'Future iterations' }]
      : []),
  ]
}

// The Reading Rail's section-jump nav: scrolls the clicked section into
// view within the content pane, and tracks which section is currently in
// view to highlight the matching rail item — scoped to the content pane's
// own scroll position, not the window, since the pane (not the page) is
// what scrolls.
function useReadingRail(reportSections: ReportSection[], resetKey: string | null) {
  const contentRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef(new Map<string, HTMLElement>())
  const [activeKey, setActiveKey] = useState<ReportSection['key']>('problem')

  // Resets the active section back to Problem whenever a different case
  // study opens. Adjusting state during render (rather than in an effect)
  // is the React-recommended way to reset state in response to a changed
  // value without an extra render: https://react.dev/learn/you-might-not-need-an-effect
  const [trackedResetKey, setTrackedResetKey] = useState(resetKey)
  if (resetKey !== trackedResetKey) {
    setTrackedResetKey(resetKey)
    setActiveKey('problem')
  }

  // Maps each section's own document position onto a scrollTop that's
  // guaranteed reachable, by rescaling the sections' natural spacing to fit
  // exactly inside the pane's actual scrollable range (0 to maxScroll).
  // Plain "scroll until this section's top reaches a reading line near the
  // pane's top" can't work in the general case: a short trailing section
  // (e.g. Outcome, sitting between a long Approach and Future Iterations)
  // can need more room to reach that line than the pane has left to scroll,
  // so its top would never cross the line at all — the rail would jump
  // straight from Approach to Future Iterations and skip it entirely, no
  // matter how small the reading-line offset was tuned to be. Rescaling
  // guarantees every section gets a proportional, non-empty share of
  // whatever scroll range actually exists, including the last one, which
  // always lands exactly on maxScroll.
  const getSectionBoundaries = (pane: HTMLDivElement) => {
    const maxScroll = pane.scrollHeight - pane.clientHeight
    const firstEl = sectionRefs.current.get(reportSections[0]?.key)
    const lastEl = sectionRefs.current.get(reportSections[reportSections.length - 1]?.key)
    const boundaries = new Map<string, number>()
    // pane.scrollHeight is 0 only before the pane has ever been laid out
    // (e.g. the very first effect run right after mount) — as opposed to
    // maxScroll being 0 because real, laid-out content simply fits without
    // scrolling. Treating those the same would jump straight to the last
    // section on open instead of leaving the reset-to-Problem in place.
    if (!firstEl || !lastEl || pane.scrollHeight === 0) return boundaries

    const span = lastEl.offsetTop - firstEl.offsetTop
    const scale = span > 0 && maxScroll > 0 ? maxScroll / span : 0
    reportSections.forEach(({ key }) => {
      const el = sectionRefs.current.get(key)
      if (el) boundaries.set(key, (el.offsetTop - firstEl.offsetTop) * scale)
    })
    return boundaries
  }

  useEffect(() => {
    const pane = contentRef.current
    if (!pane) return

    const updateActiveSection = () => {
      const boundaries = getSectionBoundaries(pane)
      let nextKey = reportSections[0]?.key
      reportSections.forEach(({ key }) => {
        const boundary = boundaries.get(key)
        // 1px tolerance: scrollTop can land fractionally short of a
        // boundary that was computed to equal maxScroll exactly.
        if (boundary !== undefined && pane.scrollTop >= boundary - 1) nextKey = key
      })

      if (nextKey) setActiveKey((current) => (current === nextKey ? current : nextKey))
    }

    updateActiveSection()
    pane.addEventListener('scroll', updateActiveSection, { passive: true })
    window.addEventListener('resize', updateActiveSection)
    return () => {
      pane.removeEventListener('scroll', updateActiveSection)
      window.removeEventListener('resize', updateActiveSection)
    }
    // reportSections is derived fresh from `selected` each render; keying
    // off its length (rather than the array reference) avoids tearing this
    // listener down and rebuilding it every render for no reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportSections.length])

  const scrollToSection = (key: ReportSection['key']) => {
    const pane = contentRef.current
    if (!pane) return
    const boundary = getSectionBoundaries(pane).get(key)
    if (boundary === undefined) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    // Scrolls to this section's own rescaled boundary rather than using
    // scrollIntoView to align its top to the pane's top — for a section
    // too close to the end to ever reach that alignment, scrollIntoView
    // would just clamp to the pane's max scroll, landing on the same
    // position a later section's nav item would, and the highlight would
    // disagree with the item just clicked.
    pane.scrollTo({ top: boundary, behavior: prefersReducedMotion ? 'auto' : 'smooth' })
  }

  const registerSection = (key: ReportSection['key']) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(key, el)
    else sectionRefs.current.delete(key)
  }

  return { contentRef, activeKey, scrollToSection, registerSection }
}

function CaseStudies() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const titleId = useId()

  const selected = caseStudies.find((caseStudy) => caseStudy.id === selectedId) ?? null
  const reportSections = selected ? reportSectionsFor(selected) : []
  const { contentRef, activeKey, scrollToSection, registerSection } = useReadingRail(
    reportSections,
    selected?.id ?? null,
  )

  return (
    <section id="case-studies" aria-label={sectionLabel}>
      <ParticleBackground variant="case-studies" />
      <div className={styles.list}>
        {caseStudies.map((caseStudy) => (
          <button
            key={caseStudy.id}
            type="button"
            className={styles.card}
            data-testid={`case-study-card-${caseStudy.id}`}
            onClick={() => setSelectedId(caseStudy.id)}
          >
            <Heading level={2}>{caseStudy.title}</Heading>
            <p className={styles.summary}>{caseStudy.summary}</p>
            <div className={styles.tags}>
              {caseStudy.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <span className={styles.affordance}>Read case study &rarr;</span>
          </button>
        ))}
      </div>

      {selected && (
        <Modal titleId={titleId} onClose={() => setSelectedId(null)} testId="case-study-modal">
          <button
            type="button"
            className={styles.close}
            onClick={() => setSelectedId(null)}
            aria-label="Close"
            data-testid="case-study-modal-close"
          >
            &times;
          </button>
          <div className={styles.rail}>
            <h2 id={titleId} data-testid="case-study-modal-title">
              {selected.title}
            </h2>
            <div className={styles.tags}>
              {selected.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <hr className={styles.railDivider} />
            {selected.highlights && selected.highlights.length > 0 && (
              <div className={styles.highlights}>
                {selected.highlights.map(({ value, label }) => (
                  <div className={styles.highlight} key={label}>
                    <span className={styles.highlightValue}>{value}</span>
                    <span className={styles.highlightLabel}>{label}</span>
                  </div>
                ))}
              </div>
            )}
            <hr className={`${styles.railDivider} ${styles.railDividerBottom}`} />
            <nav className={styles.railNav} aria-label="Case study sections">
              {reportSections.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  className={
                    key === activeKey
                      ? `${styles.navItem} ${styles.navItemActive}`
                      : styles.navItem
                  }
                  onClick={() => scrollToSection(key)}
                >
                  <span className={styles.dot} aria-hidden="true" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div
            className={styles.content}
            ref={contentRef}
            tabIndex={0}
            role="region"
            aria-labelledby={titleId}
          >
            {selected.phases && selected.phases.length > 0 && (
              <div className={styles.phaseStripSection} data-testid="case-study-phase-strip">
                <span className={styles.phaseStripLabel} id={`${titleId}-phase-strip-label`}>
                  The framework, phase by phase
                </span>
                {/* tabIndex + aria makes this reachable/nameable via keyboard
                    (axe's scrollable-region-focusable) — unlike .railNav
                    above, these phase cards are plain divs with no focusable
                    descendant of their own to satisfy that rule instead. */}
                <div
                  className={styles.phaseStrip}
                  tabIndex={0}
                  role="group"
                  aria-labelledby={`${titleId}-phase-strip-label`}
                >
                  {selected.phases.map((phase, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <div className={styles.phase} key={index}>
                      <span className={styles.phaseNumber}>{index}</span>
                      <span className={styles.phaseName}>{phase.name}</span>
                      <span className={styles.phaseTimeframe}>{phase.timeframe}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div
              className={styles.section}
              ref={registerSection('problem')}
              data-section-key="problem"
              data-testid="case-study-section-problem"
            >
              <h3>Problem</h3>
              <Paragraphs text={selected.problem} />
            </div>
            <div
              className={styles.section}
              ref={registerSection('approach')}
              data-section-key="approach"
              data-testid="case-study-section-approach"
            >
              <h3>Approach</h3>
              <Paragraphs text={selected.approach} />
            </div>
            <div
              className={styles.section}
              ref={registerSection('outcome')}
              data-section-key="outcome"
              data-testid="case-study-section-outcome"
            >
              <h3>Outcome</h3>
              <Paragraphs text={selected.outcome} />
            </div>
            {selected.futureIterations && (
              <div
                className={`${styles.section} ${styles.futureIterations}`}
                ref={registerSection('futureIterations')}
                data-section-key="futureIterations"
                data-testid="case-study-section-futureIterations"
              >
                <h3>Future iterations</h3>
                <Paragraphs text={selected.futureIterations} />
              </div>
            )}
          </div>
        </Modal>
      )}
    </section>
  )
}

export default CaseStudies
