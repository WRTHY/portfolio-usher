import type { MouseEventHandler, ReactNode } from 'react'
import { cx } from '../../../utils/classNames'
import styles from './NavLink.module.css'

type NavLinkProps = {
  href: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLAnchorElement>
  isActive?: boolean
  testId?: string
  className?: string
}

function NavLink({ href, children, onClick, isActive, testId, className }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cx(styles.link, isActive && styles.active, className)}
      aria-current={isActive ? 'location' : undefined}
      data-testid={testId}
    >
      {children}
    </a>
  )
}

export default NavLink
