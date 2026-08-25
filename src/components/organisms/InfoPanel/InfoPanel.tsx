import type { CSSProperties } from 'react'
import NavLink from '../../atoms/NavLink/NavLink'
import Button from '../../atoms/Button/Button'
import useActiveSection from '../../../hooks/useActiveSection'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'
import styles from './InfoPanel.module.css'

function InfoPanel() {
  const activeId = useActiveSection()
  // Drives the sliding marker in .nav (see InfoPanel.module.css).
  const activeIndex = sections.findIndex((section) => section.id === activeId)
  // Opposite of the active section's own background (see navigation.ts), so
  // the panel reads as a distinct surface against whichever section is
  // scrolled underneath it, fading between tones as the page scrolls rather
  // than sitting on a fixed color.
  const activeTone = sections[activeIndex]?.tone ?? 'base'
  const panelBg = activeTone === 'alt' ? 'var(--bg)' : 'var(--section-alt-bg)'

  return (
    <aside
      className={styles.infoPanel}
      aria-label="Page summary"
      style={{ '--panel-bg': panelBg } as CSSProperties}
    >
      <p className={styles.name}>{siteContent.name}</p>
      <p className={styles.tagline}>{siteContent.tagline}</p>
      <nav aria-label="Sections" className={styles.navWrap}>
        <ul
          className={styles.nav}
          style={{ '--active-index': activeIndex } as CSSProperties}
        >
          <span className={styles.marker} aria-hidden="true" />
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
      <div className={styles.resumeWrap}>
        <Button href={siteContent.resumeUrl} external fullWidth>
          My Resume
        </Button>
      </div>
    </aside>
  )
}

export default InfoPanel
