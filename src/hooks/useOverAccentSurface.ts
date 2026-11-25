import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

// Sections painted in the accent colour mark themselves with this, so fixed
// chrome passing over them (the left rail) can switch to readable colours.
export const ACCENT_SURFACE = '[data-surface="accent"]'

// Whether the middle of `ref`'s element currently sits over an accent-coloured
// section. Re-checked once a frame while the page scrolls or resizes. A
// hidden element (the rail below 1024px) has no box, so it's never "over".
function useOverAccentSurface(ref: RefObject<HTMLElement | null>): boolean {
  const [over, setOver] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let frame = 0
    const check = () => {
      frame = 0
      const box = element.getBoundingClientRect()
      if (box.width === 0 && box.height === 0) {
        setOver(false)
        return
      }
      const x = box.left + box.width / 2
      const y = box.top + box.height / 2
      const hit = [...document.querySelectorAll<HTMLElement>(ACCENT_SURFACE)].some((surface) => {
        const area = surface.getBoundingClientRect()
        return x >= area.left && x <= area.right && y >= area.top && y <= area.bottom
      })
      setOver(hit)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(check)
    }

    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [ref])

  return over
}

export default useOverAccentSurface
