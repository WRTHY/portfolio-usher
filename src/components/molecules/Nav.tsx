import { useState } from 'react'
import NavLink from '../atoms/NavLink'
import MenuToggle from '../atoms/MenuToggle'
import useActiveSection from '../../hooks/useActiveSection'
import { sections } from '../../content/navigation'

function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const activeId = useActiveSection()

  return (
    <nav>
      <MenuToggle isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />
      <ul id="site-nav-list" className={isOpen ? 'open' : undefined}>
        {sections.map((section) => (
          <li key={section.id}>
            <NavLink
              href={`#${section.id}`}
              onClick={() => setIsOpen(false)}
              isActive={activeId === section.id}
            >
              {section.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
