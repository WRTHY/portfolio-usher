import type { ReactNode } from 'react'
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
      className={[styles.button, fullWidth ? styles.fullWidth : null].filter(Boolean).join(' ')}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

export default Button
