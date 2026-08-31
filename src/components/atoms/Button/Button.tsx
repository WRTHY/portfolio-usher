import type { ReactNode } from 'react'
import { cx } from '../../../utils/classNames'
import styles from './Button.module.css'

type ButtonProps = {
  href: string
  children: ReactNode
  external?: boolean
  fullWidth?: boolean
}

function Button({ href, children, external, fullWidth }: ButtonProps) {
  return (
    <a
      href={href}
      className={cx(styles.button, fullWidth && styles.fullWidth)}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

export default Button
