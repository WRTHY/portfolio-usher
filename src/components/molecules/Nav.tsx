import NavLink from '../atoms/NavLink'

const links = [
  { href: '#about', label: 'About' },
  { href: '#case-studies', label: 'Case Studies' },
  { href: '#code-samples', label: 'Code Samples' },
  { href: '#contact', label: 'Contact' },
]

function Nav() {
  return (
    <nav>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <NavLink href={link.href}>{link.label}</NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
