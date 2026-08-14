import SectionDots from '../molecules/SectionDots'
import SocialLinks from '../molecules/SocialLinks'
import ThemeToggle from '../molecules/ThemeToggle'

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="progress-dots">
        <SectionDots />
        <ThemeToggle />
      </div>
      <SocialLinks />
    </aside>
  )
}

export default Sidebar
