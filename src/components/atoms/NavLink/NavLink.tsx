import type { MouseEventHandler, ReactNode } from 'react'
import { cx } from '../../../utils/classNames'
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
      className={cx(styles.link, isActive && styles.active)}
      aria-current={isActive ? 'page' : undefined}
      data-testid={testId}
    >
      {children}
    </a>
  )
}

export default NavLink
