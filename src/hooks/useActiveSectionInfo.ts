import { sections } from '../content/navigation'
import useActiveSection from './useActiveSection'

type Section = (typeof sections)[number]

type ActiveSectionInfo = {
  activeId: string
  activeIndex: number
  activeSection: Section | undefined
}

// Centralizes "which section object (not just id) is currently active" —
// InfoPanel (desktop) and MobileInfoCard (mobile) both need this, and each
// used to derive it independently via its own sections.find/findIndex call.
// That duplication is exactly how a new section (e.g. API Testing) could
// end up wired into one but silently missed in the other; deriving it once
// here means both stay in sync automatically.
function useActiveSectionInfo(): ActiveSectionInfo {
  const activeId = useActiveSection()
  const activeIndex = sections.findIndex((section) => section.id === activeId)
  return { activeId, activeIndex, activeSection: sections[activeIndex] }
}

export default useActiveSectionInfo
