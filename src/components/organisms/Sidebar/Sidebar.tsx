import { useRef } from 'react'
import type { ReactNode } from 'react'
import SectionDots from '../../molecules/SectionDots/SectionDots'
import SocialLinks from '../../molecules/SocialLinks/SocialLinks'
import ThemeToggle from '../../molecules/ThemeToggle/ThemeToggle'
import useElementInView from '../../../hooks/useElementInView'
import useOverAccentSurface from '../../../hooks/useOverAccentSurface'
import { cx } from '../../../utils/classNames'
import styles from './Sidebar.module.css'

// One part of the rail. It switches to the accent section's colours on its
// own, when its middle passes over one, so the dots can still be on the page
// while the socials are already over violet.
function RailGroup({ hidden = false, testId, children }: { hidden?: boolean; testId?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const onAccent = useOverAccentSurface(ref)
  return (
    <div
      ref={ref}
      className={cx(styles.group, onAccent && styles.onAccent, hidden && styles.handedOff)}
      data-on-accent={onAccent || undefined}
      data-testid={testId}
      // Out of the tab order and the accessibility tree while faded out.
      inert={hidden}
    >
      {children}
    </div>
  )
}

// The desktop left rail: a minimal strip of micro-navigation. Section
// progress dots with the light/dark toggle under them at the top, quick
// links to GitHub, email and LinkedIn at the bottom. Desktop-only (>=1024px);
// below that the top bar carries the theme toggle and its hamburger menu the
// socials. The socials fade out once the contact close comes up, since it
// carries the same links, the way the header's name waits for the hero's.
function Sidebar() {
  const contactInView = useElementInView('contact', '0px 0px -25% 0px')

  return (
    <aside className={styles.sidebar} aria-label="Quick links">
      <div className={styles.top}>
        <RailGroup>
          <SectionDots />
        </RailGroup>
        <RailGroup>
          <ThemeToggle />
        </RailGroup>
      </div>
      <RailGroup hidden={contactInView} testId="rail-socials">
        <SocialLinks />
      </RailGroup>
    </aside>
  )
}

export default Sidebar
