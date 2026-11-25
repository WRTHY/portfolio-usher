import { useEffect, useState } from 'react'

// Whether the element with this id is on screen, for chrome that reacts to
// a section arriving. rootMargin trims the viewport first, e.g. '0px 0px
// -25% 0px' to count it only once it's a quarter of the way up.
function useElementInView(id: string, rootMargin = '0px'): boolean {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const element = document.getElementById(id)
    if (!element) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    observer.observe(element)
    return () => observer.disconnect()
  }, [id, rootMargin])

  return inView
}

export default useElementInView
