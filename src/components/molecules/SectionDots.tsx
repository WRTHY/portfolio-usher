import { useEffect, useState } from 'react'
import { sections } from '../../content/navigation'

function SectionDots() {
  const [activeId, setActiveId] = useState<string>(sections[0].id)

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]

        if (mostVisible) {
          setActiveId(mostVisible.target.id)
        }
      },
      { threshold: 0.5 },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

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
