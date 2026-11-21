import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import NavLink from '../../atoms/NavLink/NavLink'
import MenuToggle from '../../atoms/MenuToggle/MenuToggle'
import Button from '../../atoms/Button/Button'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import SocialLinks from '../SocialLinks/SocialLinks'
import useActiveSection from '../../../hooks/useActiveSection'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'
import { cx } from '../../../utils/classNames'
import { locatorAttrs } from '../../../utils/locatorAttrs'
import styles from './Nav.module.css'

// The sticky top bar: wordmark left; section links and the Resume pill right.
// From 1024px the section links sit inline (nav-link-desktop-* test ids);
// below that they move into a full-height menu behind the hamburger
// (nav-link-mobile-*). Only one list is ever displayed, so only one is in the
// accessibility tree at a time. The theme toggle shows here only below
// 1024px; on desktop it lives in the left rail (see Sidebar).
//
// showName: the wordmark only shows once the hero's big name has scrolled up
// under the bar (Header tracks that). Its letters spring in when it arrives
// and drop away when you scroll back to the hero, so the name is never on
// screen twice.
type NavProps = {
  showName?: boolean
}

function Nav({ showName = true }: NavProps) {
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
      {/* Named once via aria-label: per-letter inline-block spans would
          otherwise be read (and accessibility-named) letter by letter. */}
      <a
        className={cx(styles.wordmark, !showName && styles.undocked)}
        href="#top"
        aria-label={siteContent.name}
      >
        <span aria-hidden="true">
          {siteContent.name.split('').map((letter, i) =>
            letter === ' ' ? (
              ' '
            ) : (
              <span key={i} className={styles.letter} style={{ '--i': i } as CSSProperties}>
                {letter}
              </span>
            ),
          )}
        </span>
      </a>

      <nav aria-label="Primary" className={styles.primary}>
        <ul className={styles.links}>
          {sections.map((section) => (
            <li key={section.id}>
              <NavLink
                href={`#${section.id}`}
                isActive={activeId === section.id}
                testId={`nav-link-desktop-${section.id}`}
              >
                {section.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.actions}>
        <div className={styles.barThemeToggle}>
          <ThemeToggle />
        </div>
        <a
          className={styles.resume}
          href={siteContent.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          {...locatorAttrs(
            "getByRole('banner').getByRole('link', { name: 'Resume', exact: true })",
            `toHaveAttribute('href', '${siteContent.resumeUrl}')`,
          )}
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
