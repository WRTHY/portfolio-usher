import type { MouseEventHandler, ReactNode } from 'react'
import styles from './NavLink.module.css'

type NavLinkProps = {
  href: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLAnchorElement>
  isActive?: boolean
  testId?: string
}

function NavLink({ href, children, onClick, isActive, testId }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={[styles.link, isActive ? styles.active : null].filter(Boolean).join(' ')}
      aria-current={isActive ? 'page' : undefined}
      data-testid={testId}
    >
      {children}
    </a>
  )
}

export default NavLink
