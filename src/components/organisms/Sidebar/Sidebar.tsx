import SectionDots from '../../molecules/SectionDots/SectionDots'
import SocialLinks from '../../molecules/SocialLinks/SocialLinks'
import ThemeToggle from '../../molecules/ThemeToggle/ThemeToggle'
import styles from './Sidebar.module.css'

// SectionDots stays visible at every width (pinned to the left margin on
// mobile — see Sidebar.module.css) since it's the page's only always-on
// scroll indicator. ThemeToggle/SocialLinks are desktop-only here: their
// mobile counterparts live inside the hamburger menu instead (see Nav.tsx).
function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.progressDots}>
        <SectionDots />
        <div className={styles.desktopOnly}>
          <ThemeToggle />
        </div>
      </div>
      <div className={styles.desktopOnly}>
        <SocialLinks />
      </div>
    </aside>
  )
}

export default Sidebar
