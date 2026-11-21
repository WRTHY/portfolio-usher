import type { ReactNode } from 'react'
import styles from './SectionHeader.module.css'

type SectionHeaderProps = {
  /** id for the <h2>, so the section can point aria-labelledby at it. */
  id: string
  title: string
  /** Optional one-line framing shown beside the title on wide screens. */
  intro?: ReactNode
}

// Every section's visible title, at the top of the section itself.
function SectionHeader({ id, title, intro }: SectionHeaderProps) {
  return (
    <div className={styles.head}>
      <h2 id={id} className={styles.title}>
        {title}
      </h2>
      {intro && <p className={styles.intro}>{intro}</p>}
    </div>
  )
}

export default SectionHeader
