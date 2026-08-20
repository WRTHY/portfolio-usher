import { useState } from 'react'
import useActiveSection from '../../../hooks/useActiveSection'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'
import styles from './InfoPanel.module.css'

const fallbackSection = sections.find((section) => section.id !== 'hero')!

function InfoPanel() {
  const activeId = useActiveSection()
  const isVisible = activeId !== 'hero'

  // Keeps showing the last real section's copy while the card fades out over
  // the hero (rather than snapping to the hero's own entry), so the exit
  // transition reads as "this card leaving" instead of a content flash.
  // Adjusted during render (React's recommended alternative to an effect
  // here) rather than via useEffect, so the swap lands in the same commit
  // as the section change instead of trailing it by an extra render.
  const [lastActiveId, setLastActiveId] = useState(activeId)
  const [displayedSection, setDisplayedSection] = useState(fallbackSection)

  if (activeId !== lastActiveId) {
    setLastActiveId(activeId)
    if (isVisible) {
      const next = sections.find((section) => section.id === activeId)
      if (next) {
        setDisplayedSection(next)
      }
    }
  }

  return (
    <aside
      className={[styles.infoPanel, isVisible ? null : styles.hidden].filter(Boolean).join(' ')}
      aria-label="Page summary"
      aria-hidden={!isVisible}
    >
      <p className={styles.name}>{siteContent.name}</p>
      <p className={styles.tagline}>{siteContent.tagline}</p>
      <div className={styles.section} key={displayedSection.id}>
        <h2 className={styles.sectionLabel}>{displayedSection.label}</h2>
        <p className={styles.sectionDescription}>{displayedSection.description}</p>
      </div>
    </aside>
  )
}

export default InfoPanel
