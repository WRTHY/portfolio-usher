import { useEffect, useState } from 'react'
import { sections } from '../content/navigation'

// Tracks which section is most visible, for highlighting the current
// position in both the sidebar dots and the header nav. Keeps a running
// map of every section's last-known visibility ratio (rather than only
// reacting to whichever entries happen to be in the current callback
// batch) so there's never a gap where nothing qualifies as "active" —
// e.g. the instant between one section dropping below intersecting and
// the next one crossing above it.
function useActiveSection(): string {
  const [activeId, setActiveId] = useState<string>(sections[0].id)

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((el): el is HTMLElement => el !== null)

    const ratios = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          ratios.set(entry.target.id, entry.intersectionRatio)
        })

        const best = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0]

        if (best && best[1] > 0) {
          setActiveId(best[0])
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return activeId
}

export default useActiveSection
