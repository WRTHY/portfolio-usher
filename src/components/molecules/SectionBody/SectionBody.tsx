import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../../utils/classNames'
import styles from './SectionBody.module.css'

type SectionBodyProps = {
  gap?: number
  className?: string
  children: ReactNode
}

// The "flush full-bleed content column" every non-hero section wraps its
// content in: cancels the shared reading-column inset (see index.css's
// `section > *` rule) so wide content lines up at the same anchor as its
// siblings, and lifts above the absolutely-positioned particle layer so it
// paints in front rather than behind it. Previously hand-rolled, byte-for-
// byte identical, in About/Experience/CaseStudies/CodeSamples.
function SectionBody({ gap = 20, className, children }: SectionBodyProps) {
  return (
    <div className={cx(styles.body, className)} style={{ gap } as CSSProperties}>
      {children}
    </div>
  )
}

export default SectionBody
