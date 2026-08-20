import NavLink from '../../atoms/NavLink/NavLink'
import useActiveSection from '../../../hooks/useActiveSection'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'
import styles from './InfoPanel.module.css'

function InfoPanel() {
  const activeId = useActiveSection()
  const isVisible = activeId !== 'hero'

  return (
    <aside
      className={[styles.infoPanel, isVisible ? null : styles.hidden].filter(Boolean).join(' ')}
      aria-label="Page summary"
      aria-hidden={!isVisible}
    >
      <p className={styles.name}>{siteContent.name}</p>
      <p className={styles.tagline}>{siteContent.tagline}</p>
      <nav aria-label="Sections" className={styles.navWrap}>
        <ul className={styles.nav}>
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
