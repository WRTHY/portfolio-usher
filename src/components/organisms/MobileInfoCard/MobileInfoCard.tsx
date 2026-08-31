import useMobileCardVisibility from '../../../hooks/useMobileCardVisibility'
import useActiveSection from '../../../hooks/useActiveSection'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'
import { cx } from '../../../utils/classNames'
import styles from './MobileInfoCard.module.css'

// Mobile counterpart to InfoPanel's desktop aside — see InfoPanel.tsx. Kept
// as its own component rather than folded into InfoPanel since it shows a
// trimmed subset of the same content (no nav, no resume link) in a
// completely different fixed position, and reveals/hides on scroll instead
// of always being visible. The active section label sits right-justified
// beside the name and wraps under it if the two would otherwise collide
// (see .row in the CSS module). All of the show/hide/reveal logic — scroll
// direction, near-top, and the settle-on-a-new-section reveal — lives in
// useMobileCardVisibility.
function MobileInfoCard() {
  const activeId = useActiveSection()
  const activeSection = sections.find((section) => section.id === activeId)
  const { visible, eased } = useMobileCardVisibility(activeId, 120)

  return (
    <aside
      className={cx(styles.card, !visible && styles.cardHidden, eased && styles.cardEased)}
      aria-label="Page summary"
      aria-hidden={!visible}
      data-testid="mobile-info-card"
    >
      <div className={styles.row}>
        <p className={styles.name}>{siteContent.name}</p>
        {activeSection && <p className={styles.section}>{activeSection.label}</p>}
      </div>
      <p className={styles.tagline}>{siteContent.tagline}</p>
      <p className={styles.quickSummary}>{siteContent.quickSummary}</p>
    </aside>
  )
}

export default MobileInfoCard
