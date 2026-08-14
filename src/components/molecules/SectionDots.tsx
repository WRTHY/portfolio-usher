import useActiveSection from '../../hooks/useActiveSection'
import { sections } from '../../content/navigation'

function SectionDots() {
  const activeId = useActiveSection()

  return (
    <ul className="section-dots">
      {sections.map((section) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            aria-label={section.label}
            aria-current={activeId === section.id ? 'true' : undefined}
            className={activeId === section.id ? 'active' : undefined}
          />
        </li>
      ))}
    </ul>
  )
}

export default SectionDots
