import type { ReactNode } from 'react'
import styles from './Button.module.css'

type ButtonProps = {
  href: string
  children: ReactNode
  external?: boolean
}

function Button({ href, children, external }: ButtonProps) {
  return (
    <a
      href={href}
      className={styles.button}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

export default Button
