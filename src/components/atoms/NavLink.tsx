import type { ReactNode } from 'react'

type NavLinkProps = {
  href: string
  children: ReactNode
}

function NavLink({ href, children }: NavLinkProps) {
  return <a href={href}>{children}</a>
}

export default NavLink
