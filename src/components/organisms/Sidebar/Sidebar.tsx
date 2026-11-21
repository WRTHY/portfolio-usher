import SectionDots from '../../molecules/SectionDots/SectionDots'
import SocialLinks from '../../molecules/SocialLinks/SocialLinks'
import styles from './Sidebar.module.css'

// The desktop left rail: section progress dots up top, social links at the
// bottom. Desktop-only (>=1024px, alongside InfoPanel); below that the top
// bar's hamburger menu carries navigation and socials instead. The theme
// toggle lives in the top bar at every width, so it isn't repeated here.
function Sidebar() {
  return (
    <aside className={styles.sidebar} aria-label="Section progress">
      <SectionDots />
      <SocialLinks />
    </aside>
  )
}

export default Sidebar
