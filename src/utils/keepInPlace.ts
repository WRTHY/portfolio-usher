type Options = {
  /** How long the page around the element keeps moving, in ms. */
  duration: number
  reducedMotion: boolean
}

const READER_INPUT = ['wheel', 'touchstart', 'keydown'] as const

// Holds an element still on screen while the page above it changes height
// (a row above it folding away). Each frame it scrolls by however far the
// element drifted, so nothing has to be estimated up front, and scroll
// anchoring is held off meanwhile so the browser doesn't also correct. A
// wheel, touch or key from the reader stops it, and so does the returned
// function.
export function keepInPlace(element: HTMLElement, { duration, reducedMotion }: Options): () => void {
  const top = element.getBoundingClientRect().top
  const drift = () => element.getBoundingClientRect().top - top

  // Without motion the page settles at once, so one correction, after it has.
  if (reducedMotion) {
    const frame = requestAnimationFrame(() => window.scrollBy({ top: drift(), behavior: 'instant' }))
    return () => cancelAnimationFrame(frame)
  }

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
    window.scrollBy({ top: drift(), behavior: 'instant' })
    if (now - start < duration) frame = requestAnimationFrame(step)
    else stop()
  }

  READER_INPUT.forEach((type) => window.addEventListener(type, stop, { passive: true }))
  frame = requestAnimationFrame(step)
  return stop
}
