import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../../utils/classNames'
import styles from './SectionBody.module.css'

type SectionBodyProps = {
  gap?: number
  className?: string
  children: ReactNode
}

// The content column every section wraps its content in, under its
// SectionHeader: a flex column with a configurable gap.
function SectionBody({ gap = 20, className, children }: SectionBodyProps) {
  return (
    <div className={cx(styles.body, className)} style={{ gap } as CSSProperties}>
      {children}
    </div>
  )
}

export default SectionBody
