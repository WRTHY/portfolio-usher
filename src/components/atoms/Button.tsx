import type { ReactNode } from 'react'

type ButtonProps = {
  href: string
  children: ReactNode
  external?: boolean
}

function Button({ href, children, external }: ButtonProps) {
  return (
    <a
      href={href}
      className="btn"
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  )
}

export default Button
