import type { ReactNode } from 'react'
import styles from './SectionHeader.module.css'

type SectionHeaderProps = {
  /** id for the <h2>, so the section can point aria-labelledby at it. */
  id: string
  title: string
  /** Optional one-line framing shown beside the title on wide screens. */
  intro?: ReactNode
  /** How many items the section holds, shown small beside the title, e.g.
   *  "Projects (2)" so a reader knows there's more than the first. Visual
   *  only: the items themselves are all in the section for a screen reader. */
  count?: number
  /** Anything else to set beside the title, e.g. an index of what's in the
   *  section. Rendered as given, not as a paragraph. */
  aside?: ReactNode
}

// Every section's visible title, at the top of the section itself.
function SectionHeader({ id, title, intro, count, aside }: SectionHeaderProps) {
  return (
    <div className={styles.head}>
      <h2 id={id} className={styles.title}>
        {title}
        {count !== undefined && (
          <span className={styles.count} aria-hidden="true" data-testid="section-count">
            ({count})
          </span>
        )}
      </h2>
      {intro && <p className={styles.intro}>{intro}</p>}
      {aside}
    </div>
  )
}

export default SectionHeader
