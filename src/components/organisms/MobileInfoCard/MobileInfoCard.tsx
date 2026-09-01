import useMobileCardVisibility from '../../../hooks/useMobileCardVisibility'
import useActiveSectionInfo from '../../../hooks/useActiveSectionInfo'
import { siteContent } from '../../../content/site'
import { cx } from '../../../utils/classNames'
import styles from './MobileInfoCard.module.css'

// Mobile counterpart to InfoPanel's desktop aside — see InfoPanel.tsx. Kept
// as its own component rather than folded into InfoPanel since it shows a
// trimmed subset of the same content (name + "which section", no role, nav,
// or resume link) in a completely different fixed position, and reveals/
// hides on scroll instead of always being visible. The role (tagline) and
// quickSummary both live in the hamburger menu instead (see Nav.tsx) —
// keeping this card to just identity + "which section" kept it from
// getting cluttered. Which section object is active comes from
// useActiveSectionInfo, shared with InfoPanel, rather than each deriving
// it independently via its own sections.find/findIndex call — the kind of
// duplication where a future new section could easily get wired into one
// but not the other. All of the show/hide/reveal logic — scroll direction,
// near-top, and the settle-on-a-new-section reveal — lives in
// useMobileCardVisibility.
function MobileInfoCard() {
  const { activeId, activeSection } = useActiveSectionInfo()
  const { visible, eased } = useMobileCardVisibility(activeId, 120)

  return (
    <aside
      className={cx(styles.card, !visible && styles.cardHidden, eased && styles.cardEased)}
      aria-label="Page summary"
      aria-hidden={!visible}
      data-testid="mobile-info-card"
    >
      <p className={styles.name}>{siteContent.name}</p>
      {activeSection && <p className={styles.section}>{activeSection.label}</p>}
    </aside>
  )
}

export default MobileInfoCard
