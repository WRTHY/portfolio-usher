import type { MouseEventHandler, ReactNode } from 'react'

type NavLinkProps = {
  href: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLAnchorElement>
  isActive?: boolean
}

function NavLink({ href, children, onClick, isActive }: NavLinkProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={isActive ? 'active' : undefined}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </a>
  )
}

export default NavLink
