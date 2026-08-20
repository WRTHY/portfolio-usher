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
  key: 'problem' | 'approach' | 'futureIterations' | 'outcome'
  label: string
}

function reportSectionsFor(caseStudy: CaseStudy): ReportSection[] {
  return [
    { key: 'problem', label: 'Problem' },
    { key: 'approach', label: 'Approach' },
    ...(caseStudy.futureIterations
      ? [{ key: 'futureIterations' as const, label: 'Future iterations' }]
      : []),
    { key: 'outcome', label: 'Outcome' },
  ]
}

// The Reading Rail's section-jump nav: scrolls the clicked section into
// view within the content pane, and tracks which section is currently
// in view to highlight the matching rail item — scoped to the content
// pane as the IntersectionObserver root, not the window, since the pane
// (not the page) is what scrolls.
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

  useEffect(() => {
    const root = contentRef.current
    if (!root) return

    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const key = entry.target.getAttribute('data-section-key')
          if (key) ratios.set(key, entry.intersectionRatio)
        })

        const best = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0]
        if (best && best[1] > 0) {
          setActiveKey(best[0] as ReportSection['key'])
        }
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    reportSections.forEach(({ key }) => {
      const el = sectionRefs.current.get(key)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
    // reportSections is derived fresh from `selected` each render; keying
    // off its length (rather than the array reference) avoids tearing the
    // observer down and rebuilding it every render for no reason.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportSections.length])

  const scrollToSection = (key: ReportSection['key']) => {
    const el = sectionRefs.current.get(key)
    if (!el) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' })
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
        <Modal titleId={titleId} onClose={() => setSelectedId(null)}>
          <button
            type="button"
            className="modal-close"
            onClick={() => setSelectedId(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <div className={styles.rail}>
            <div className={styles.tags}>
              {selected.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <h2 id={titleId}>{selected.title}</h2>
            <hr className={styles.railDivider} />
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
          <div className={styles.content} ref={contentRef}>
            <div className={styles.section} ref={registerSection('problem')} data-section-key="problem">
              <h3>Problem</h3>
              <p>{selected.problem}</p>
            </div>
            <div className={styles.section} ref={registerSection('approach')} data-section-key="approach">
              <h3>Approach</h3>
              <p>{selected.approach}</p>
            </div>
            {selected.futureIterations && (
              <div
                className={`${styles.section} ${styles.futureIterations}`}
                ref={registerSection('futureIterations')}
                data-section-key="futureIterations"
              >
                <h3>Future iterations</h3>
                <p>{selected.futureIterations}</p>
              </div>
            )}
            <div className={styles.section} ref={registerSection('outcome')} data-section-key="outcome">
              <h3>Outcome</h3>
              <p>{selected.outcome}</p>
            </div>
          </div>
          </div>
        </Modal>
      )}
    </section>
  )
}

export default CaseStudies
