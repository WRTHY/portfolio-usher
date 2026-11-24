import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { keepInPlace } from './keepInPlace'

// An element whose top is whatever the test says, as the page above it folds.
function elementAt(initialTop: number) {
  let top = initialTop
  const element = document.createElement('div')
  element.getBoundingClientRect = () => ({ top }) as DOMRect
  return { element, moveTo: (next: number) => (top = next) }
}

describe('keepInPlace', () => {
  const scrollBy = vi.fn()

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
    window.scrollBy = scrollBy
  })

  afterEach(() => {
    scrollBy.mockClear()
    document.documentElement.style.overflowAnchor = ''
    vi.useRealTimers()
  })

  it('scrolls each frame by how far the element has drifted, so it stays put', () => {
    const { element, moveTo } = elementAt(400)
    keepInPlace(element, { duration: 200, reducedMotion: false })

    moveTo(350)
    vi.advanceTimersByTime(16)
    expect(scrollBy).toHaveBeenLastCalledWith({ top: -50, behavior: 'instant' })

    moveTo(300)
    vi.advanceTimersByTime(16)
    expect(scrollBy).toHaveBeenLastCalledWith({ top: -100, behavior: 'instant' })
  })

  it('holds scroll anchoring off while it runs, and gives it back when it is done', () => {
    document.documentElement.style.overflowAnchor = 'auto'
    const { element } = elementAt(400)
    keepInPlace(element, { duration: 100, reducedMotion: false })
    expect(document.documentElement.style.overflowAnchor).toBe('none')

    vi.advanceTimersByTime(400)
    expect(document.documentElement.style.overflowAnchor).toBe('auto')
    const calls = scrollBy.mock.calls.length
    vi.advanceTimersByTime(400)
    expect(scrollBy).toHaveBeenCalledTimes(calls)
  })

  it('stops when the reader takes over the scroll', () => {
    const { element } = elementAt(400)
    keepInPlace(element, { duration: 500, reducedMotion: false })
    vi.advanceTimersByTime(32)
    const calls = scrollBy.mock.calls.length

    window.dispatchEvent(new Event('wheel'))
    vi.advanceTimersByTime(200)
    expect(scrollBy).toHaveBeenCalledTimes(calls)
  })

  it('without motion, corrects once, after the page has settled', () => {
    const { element, moveTo } = elementAt(400)
    keepInPlace(element, { duration: 500, reducedMotion: true })

    moveTo(200)
    vi.advanceTimersByTime(100)
    expect(scrollBy).toHaveBeenCalledTimes(1)
    expect(scrollBy).toHaveBeenCalledWith({ top: -200, behavior: 'instant' })
  })
})
