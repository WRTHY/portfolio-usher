import type { ReactNode } from 'react'
import { skillPillVars } from '../../../styles/syntaxPalette'
import type { SkillColorway } from '../../../styles/syntaxPalette'
import { cx } from '../../../utils/classNames'
import styles from './Badge.module.css'

type BadgeProps = {
  children: ReactNode
  variant?: 'accent' | 'muted' | 'outline-accent'
  // Swaps the accent tint for one of the Skills & Tools category hues.
  // Only meaningful on the default 'accent' variant.
  colorway?: SkillColorway
}

function Badge({ children, variant = 'accent', colorway }: BadgeProps) {
  return (
    <span
      className={cx(
        styles.badge,
        variant === 'muted' && styles.muted,
        variant === 'outline-accent' && styles.outlineAccent,
        colorway && styles.skill,
      )}
      style={colorway ? skillPillVars(colorway) : undefined}
    >
      {children}
    </span>
  )
}

export default Badge
