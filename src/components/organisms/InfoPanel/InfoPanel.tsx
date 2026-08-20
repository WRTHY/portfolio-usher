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

  return (
    <aside className={styles.infoPanel} aria-label="Page summary">
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
      <div className={styles.resumeWrap}>
        <Button href={siteContent.resumeUrl} external fullWidth>
          My Resume
        </Button>
      </div>
    </aside>
  )
}

export default InfoPanel
