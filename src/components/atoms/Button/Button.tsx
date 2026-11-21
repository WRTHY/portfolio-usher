import type { ReactNode } from 'react'
import { cx } from '../../../utils/classNames'
import styles from './Button.module.css'

type ButtonProps = {
  href: string
  children: ReactNode
  /** primary: solid violet (the page's one main action). ghost: outlined. */
  variant?: 'primary' | 'ghost'
  external?: boolean
  fullWidth?: boolean
  className?: string
}

function Button({ href, children, variant = 'primary', external, fullWidth, className }: ButtonProps) {
  return (
    <a
      href={href}
      className={cx(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

export default Button
