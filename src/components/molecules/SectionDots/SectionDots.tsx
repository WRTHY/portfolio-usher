import useActiveSection from '../../../hooks/useActiveSection'
import { sections } from '../../../content/navigation'
import styles from './SectionDots.module.css'

// The hero counts as a page here, unlike in the header: it's the first dot,
// and the active one until the reader scrolls into a section.
const HERO = { id: 'top', label: 'Intro' }

function SectionDots() {
  const activeId = useActiveSection() || HERO.id

  return (
    <ul className={styles.dots}>
      {[HERO, ...sections].map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            aria-label={section.label}
            aria-current={activeId === section.id ? 'true' : undefined}
            className={activeId === section.id ? styles.active : undefined}
          />
        </li>
      ))}
    </ul>
  )
}

export default SectionDots
