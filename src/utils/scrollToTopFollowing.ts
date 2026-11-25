type Options = {
  /** How long the page around the element keeps moving, in ms. */
  duration: number
  reducedMotion: boolean
  /** Regions that are folding away to nothing as this starts. */
  folding?: readonly HTMLElement[]
}

const READER_INPUT = ['wheel', 'touchstart', 'keydown'] as const

// Brings an element to the top of the viewport (just under its
// scroll-margin-top) while the page is still moving: regions folding away,
// itself unfolding. A smooth scrollIntoView aims at where the element is
// when it starts, so it overshoots once a region above it folds. This works
// out where the element will be once those regions are gone (only the ones
// above it move it) and eases the page there, one way, in step with the
// folding. Scroll anchoring is held off meanwhile, so the browser doesn't
// also correct for the fold. A wheel, touch or key from the reader stops
// it, and so does the returned function.
export function scrollToTopFollowing(element: HTMLElement, { duration, reducedMotion, folding = [] }: Options): () => void {
  // Without motion the page settles at once, so one jump, after it has.
  if (reducedMotion) {
    const frame = requestAnimationFrame(() => element.scrollIntoView({ block: 'start', behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }

  const margin = parseFloat(getComputedStyle(element).scrollMarginTop) || 0
  const lostAbove = folding
    .filter((region) => region.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)
    .reduce((sum, region) => sum + region.getBoundingClientRect().height, 0)
  const from = window.scrollY
  const to = from + element.getBoundingClientRect().top - lostAbove - margin

  const root = document.documentElement
  const anchoring = root.style.overflowAnchor
  root.style.overflowAnchor = 'none'

  let start: number | undefined
  let frame = 0

  const stop = () => {
    cancelAnimationFrame(frame)
    root.style.overflowAnchor = anchoring
    READER_INPUT.forEach((type) => window.removeEventListener(type, stop))
  }

  const step = (now: number) => {
    start ??= now
    const progress = Math.min((now - start) / duration, 1)
    const eased = 1 - (1 - progress) ** 3
    if (progress < 1) {
      window.scrollTo({ top: from + (to - from) * eased, behavior: 'instant' })
      frame = requestAnimationFrame(step)
      return
    }
    // The page has settled by now: the last frame goes by where the
    // element really is, not the estimate, so it lands exactly.
    window.scrollBy({ top: element.getBoundingClientRect().top - margin, behavior: 'instant' })
    stop()
  }

  READER_INPUT.forEach((type) => window.addEventListener(type, stop, { passive: true }))
  frame = requestAnimationFrame(step)
  return stop
}
