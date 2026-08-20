import type { CSSProperties } from 'react'
import NavLink from '../../atoms/NavLink/NavLink'
import useActiveSection from '../../../hooks/useActiveSection'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'
import styles from './InfoPanel.module.css'

function InfoPanel() {
  const activeId = useActiveSection()
  const isVisible = activeId !== 'hero'
  // Drives the sliding marker in .nav (see InfoPanel.module.css) — falls
  // back to the first item's position while on the hero, where the panel
  // itself is faded out but still mounted.
  const activeIndex = Math.max(
    0,
    sections.findIndex((section) => section.id === activeId),
  )

  return (
    <aside
      className={[styles.infoPanel, isVisible ? null : styles.hidden].filter(Boolean).join(' ')}
      aria-label="Page summary"
      aria-hidden={!isVisible}
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
              <NavLink href={`#${section.id}`} isActive={activeId === section.id}>
                {section.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default InfoPanel
