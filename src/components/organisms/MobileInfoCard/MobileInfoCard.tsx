import type { CSSProperties } from 'react'
import { contrastSurface } from '../../../content/navigation'
import type { SectionTone } from '../../../content/navigation'
import { siteContent } from '../../../content/site'
import styles from './MobileInfoCard.module.css'

type MobileInfoCardProps = {
  label: string
  // The hosting section's tone - the card takes the opposite surface, the
  // same alternating rule the section's own cards and InfoPanel follow.
  tone: SectionTone
}

// Mobile counterpart to InfoPanel's desktop aside - see InfoPanel.tsx. Each
// section renders its own instance, pinned in place inside that section's
// own top gap (see the module CSS) rather than one shared instance floating
// fixed over the viewport and tracking scroll to know which section it's
// over - it scrolls away with its own section like ordinary page content
// now, instead of reappearing/hiding based on scroll direction. That also
// means it just takes the label as a prop instead of deriving "which
// section is active" itself. Shows a trimmed subset of InfoPanel's content
// (name + this section's label, no role, nav, or resume link) - the role
// (tagline) and quickSummary both live in the hamburger menu instead (see
// Nav.tsx) - keeping this to just identity + label kept it from getting
// cluttered.
function MobileInfoCard({ label, tone }: MobileInfoCardProps) {
  return (
    <div
      className={styles.card}
      style={{ '--card-bg': contrastSurface(tone) } as CSSProperties}
      aria-hidden="true"
      data-testid="mobile-info-card"
    >
      <p className={styles.name}>{siteContent.name}</p>
      <p className={styles.section}>{label}</p>
    </div>
  )
}

export default MobileInfoCard
