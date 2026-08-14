import { useEffect, useRef } from 'react'

// Attach the returned ref to the last piece of scrollable content. When the
// user keeps scrolling down after reaching the bottom of the page, briefly
// adds a "bump" class as a nudge that there's nothing more below. The CSS
// animation itself (see App.css) removes the class via `animationend`, so
// this hook doesn't need to track a duplicate timer/duration.
function useOverscrollBump<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const clearBump = () => element.classList.remove('bump')
    element.addEventListener('animationend', clearBump)

    const handleWheel = (event: WheelEvent) => {
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1

      if (!atBottom || event.deltaY <= 0) return

      // Remove + force reflow so the animation restarts even if a bump is
      // already mid-run, instead of no-opping on rapid consecutive scrolls.
      element.classList.remove('bump')
      void element.offsetWidth
      element.classList.add('bump')
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      element.removeEventListener('animationend', clearBump)
    }
  }, [])

  return ref
}

export default useOverscrollBump
