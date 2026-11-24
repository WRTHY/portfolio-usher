import { useEffect, useState } from 'react'
import { sections } from '../content/navigation'

// Where a section counts as reached: its top has scrolled up past this share
// of the viewport's height.
const LINE = 0.4

// Which nav section the reader is in, for the header links and the rail's
// dots: the last section whose top has scrolled up past the line. None while
// the hero fills the screen, so nothing is marked before the reader has
// actually scrolled to a section. Checked once per frame while scrolling.
function useActiveSection(): string {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const line = window.innerHeight * LINE
      let current = ''
      for (const { id } of sections) {
        const element = document.getElementById(id)
        if (element && element.getBoundingClientRect().top <= line) current = id
      }
      setActiveId(current)
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return activeId
}

export default useActiveSection
