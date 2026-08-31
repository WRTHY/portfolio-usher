import type { ReactNode } from 'react'
import { cx } from '../../../utils/classNames'
import styles from './Badge.module.css'

type BadgeProps = {
  children: ReactNode
  variant?: 'accent' | 'muted' | 'outline-accent'
}

function Badge({ children, variant = 'accent' }: BadgeProps) {
  return (
    <span
      className={cx(
        styles.badge,
        variant === 'muted' && styles.muted,
        variant === 'outline-accent' && styles.outlineAccent,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
