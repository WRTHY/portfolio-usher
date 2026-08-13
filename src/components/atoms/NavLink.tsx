import type { MouseEventHandler, ReactNode } from 'react'

type NavLinkProps = {
  href: string
  children: ReactNode
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

function NavLink({ href, children, onClick }: NavLinkProps) {
  return (
    <a href={href} onClick={onClick}>
      {children}
    </a>
  )
}

export default NavLink
