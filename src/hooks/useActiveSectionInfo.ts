import { sections } from '../content/navigation'
import useActiveSection from './useActiveSection'

type Section = (typeof sections)[number]

type ActiveSectionInfo = {
  activeId: string
  activeIndex: number
  activeSection: Section | undefined
}

// Centralizes "which section object (not just id) is currently active" for
// InfoPanel (desktop) - both the active index (drives its sliding nav
// marker) and the active section's own tone (crossfades its background).
function useActiveSectionInfo(): ActiveSectionInfo {
  const activeId = useActiveSection()
  const activeIndex = sections.findIndex((section) => section.id === activeId)
  return { activeId, activeIndex, activeSection: sections[activeIndex] }
}

export default useActiveSectionInfo
