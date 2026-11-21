import { useId, useState } from 'react'
import { getSectionLabel } from '../../../content/navigation'
import { experience, experienceIntro } from '../../../content/experience'
import type { ExperienceEntry } from '../../../content/experience'
import Heading from '../../atoms/Heading/Heading'
import ExpandToggle from '../../atoms/ExpandToggle/ExpandToggle'
import SectionHeader from '../../molecules/SectionHeader/SectionHeader'
import { cx } from '../../../utils/classNames'
import styles from './Experience.module.css'

const sectionLabel = getSectionLabel('experience')

// One ledger row. Collapsed it reads dates · role and company · the
// one-sentence impact · up to four tools; the "+" opens the full write-up and
// the complete stack in place.
function ExperienceRow({ entry }: { entry: ExperienceEntry }) {
  const [open, setOpen] = useState(false)
  const detailsId = useId()

  return (
    <li className={cx(styles.row, open && styles.open)} data-testid={`experience-${entry.id}`}>
      <p className={styles.dates}>{entry.dates}</p>
      <div className={styles.role}>
        <Heading level={3}>{entry.role}</Heading>
        <a className={styles.company} href={entry.companyUrl} target="_blank" rel="noopener noreferrer">
          {entry.company}
        </a>
      </div>
      <p className={styles.impact}>{entry.impact}</p>
      <ul className={styles.tools} aria-label={`Key tools as ${entry.role}`}>
        {entry.keyTools.map((tool) => (
          <li key={tool}>{tool}</li>
        ))}
      </ul>
      <ExpandToggle
        className={styles.toggle}
        expanded={open}
        onToggle={() => setOpen((value) => !value)}
        controls={detailsId}
        label={`Details: ${entry.role}`}
      />
      <div id={detailsId} className={styles.details} hidden={!open}>
        <p className={styles.summary}>{entry.summary}</p>
        {entry.stack && (
          <ul className={styles.stack} aria-label={`Full stack as ${entry.role}`}>
            {entry.stack.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

// A ledger, not cards: one row per role, newest first, so the whole career
// scans in a few seconds and each role opens up on demand.
function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading">
      <SectionHeader id="experience-heading" title={sectionLabel} intro={experienceIntro} />
      <div className={styles.ledgerFrame}>
        <ol className={styles.ledger}>
          {experience.map((entry) => (
            <ExperienceRow key={entry.id} entry={entry} />
          ))}
        </ol>
      </div>
    </section>
  )
}

export default Experience
