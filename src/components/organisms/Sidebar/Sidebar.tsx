import SectionDots from '../../molecules/SectionDots/SectionDots'
import SocialLinks from '../../molecules/SocialLinks/SocialLinks'
import ThemeToggle from '../../molecules/ThemeToggle/ThemeToggle'
import styles from './Sidebar.module.css'

// The desktop left rail: a minimal strip of micro-navigation. Section
// progress dots with the light/dark toggle under them at the top, quick
// links to GitHub, email and LinkedIn at the bottom. Desktop-only (>=1024px);
// below that the top bar carries the theme toggle and its hamburger menu the
// socials.
function Sidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Quick links">
      <div className={styles.top}>
        <SectionDots />
        <ThemeToggle />
      </div>
      <SocialLinks />
    </aside>
  )
}

export default Sidebar
