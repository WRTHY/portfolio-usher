import SectionDots from '../molecules/SectionDots'
import SocialLinks from '../molecules/SocialLinks'
import ThemeToggle from '../molecules/ThemeToggle'
import styles from './Sidebar.module.css'

function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.progressDots}>
        <SectionDots />
        <ThemeToggle />
      </div>
      <SocialLinks />
    </aside>
  )
}

export default Sidebar
