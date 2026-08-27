import { useState } from 'react'
import NavLink from '../../atoms/NavLink/NavLink'
import MenuToggle from '../../atoms/MenuToggle/MenuToggle'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import SocialLinks from '../SocialLinks/SocialLinks'
import Button from '../../atoms/Button/Button'
import useActiveSection from '../../../hooks/useActiveSection'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'
import styles from './Nav.module.css'

// Below 640px, Sidebar (ThemeToggle/SocialLinks) and InfoPanel (the resume
// button) are both display:none — see their module CSS — so this panel is
// the only place those controls exist on mobile. It duplicates them rather
// than reusing a shared "mobile-only" wrapper since each one still renders
// independently at desktop widths from its own fixed-position component.
function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const activeId = useActiveSection()

  return (
    <nav className={styles.nav}>
      <MenuToggle isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />
      <div
        className={[styles.panel, isOpen ? styles.open : null].filter(Boolean).join(' ')}
      >
        <div className={styles.themeToggleWrap}>
          <ThemeToggle />
        </div>
        <ul id="site-nav-list" className={styles.list}>
          {sections.map((section) => (
            <li key={section.id}>
              <NavLink
                href={`#${section.id}`}
                onClick={() => setIsOpen(false)}
                isActive={activeId === section.id}
                testId={`nav-link-mobile-${section.id}`}
              >
                {section.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className={styles.footer}>
          <SocialLinks className={styles.socialLinks} />
          <Button href={siteContent.resumeUrl} external fullWidth>
            My Resume
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Nav
