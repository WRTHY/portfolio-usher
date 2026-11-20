import { useEffect, useRef, useState } from 'react'
import NavLink from '../../atoms/NavLink/NavLink'
import MenuToggle from '../../atoms/MenuToggle/MenuToggle'
import Button from '../../atoms/Button/Button'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import SocialLinks from '../SocialLinks/SocialLinks'
import useActiveSection from '../../../hooks/useActiveSection'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'
import { cx } from '../../../utils/classNames'
import styles from './Nav.module.css'

// The sticky top bar: wordmark left; theme toggle and the Resume pill right.
// Section links live in InfoPanel's left nav card on desktop (>=1024px, with
// the nav-link-desktop-* test ids) and, below that, in the full-height menu
// behind this bar's hamburger (nav-link-mobile-*). Only one of the two is
// ever displayed, so only one is in the accessibility tree at a time.
function Nav() {
  const [isOpen, setIsOpen] = useState(false)
  const activeId = useActiveSection()
  const toggleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      toggleRef.current?.querySelector('button')?.focus()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <div className={styles.bar}>
      <a className={styles.wordmark} href={`#${sections[0].id}`}>
        {siteContent.name}
      </a>

      <div className={styles.actions}>
        <ThemeToggle />
        <a
          className={styles.resume}
          href={siteContent.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
        <div ref={toggleRef} className={styles.toggleWrap}>
          <MenuToggle isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />
        </div>
      </div>

      <div id="site-nav-list" className={cx(styles.panel, isOpen && styles.open)}>
        <nav aria-label="Menu">
          <ul className={styles.menuLinks}>
            {sections.map((section) => (
              <li key={section.id}>
                <NavLink
                  href={`#${section.id}`}
                  onClick={() => setIsOpen(false)}
                  isActive={activeId === section.id}
                  testId={`nav-link-mobile-${section.id}`}
                  className={styles.menuLink}
                >
                  {section.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className={styles.panelFooter}>
          <p className={styles.tagline}>{siteContent.tagline}</p>
          <SocialLinks className={styles.socials} />
          <Button href={siteContent.resumeUrl} external fullWidth>
            Download resume
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Nav
