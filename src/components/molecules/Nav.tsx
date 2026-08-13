import { useState } from 'react'
import NavLink from '../atoms/NavLink'
import MenuToggle from '../atoms/MenuToggle'

const links = [
  { href: '#about', label: 'About' },
  { href: '#case-studies', label: 'Case Studies' },
  { href: '#code-samples', label: 'Code Samples' },
  { href: '#contact', label: 'Contact' },
]

function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav>
      <MenuToggle isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />
      <ul id="site-nav-list" className={isOpen ? 'open' : undefined}>
        {links.map((link) => (
          <li key={link.href}>
            <NavLink href={link.href} onClick={() => setIsOpen(false)}>
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
