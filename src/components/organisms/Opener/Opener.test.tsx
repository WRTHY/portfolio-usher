import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Opener from './Opener'
import { INTRO_SEEN_KEY, OPENER_DONE_EVENT } from '../../../utils/intro'
import { hero } from '../../../content/hero'

const root = document.documentElement

describe('Opener', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    sessionStorage.clear()
    root.classList.remove('intro', 'play')
  })

  afterEach(() => {
    vi.useRealTimers()
    root.classList.remove('intro', 'play')
  })

  it("renders nothing when index.html didn't ask for the intro", () => {
    render(<Opener />)
    expect(screen.queryByTestId('opener')).not.toBeInTheDocument()
  })

  it('runs every result line, then hands off to the page', () => {
    root.classList.add('intro')
    const onDone = vi.fn()
    window.addEventListener(OPENER_DONE_EVENT, onDone)
    render(<Opener />)
    expect(screen.getByTestId('opener')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(520 + hero.run.results.length * 250))
    expect(screen.getByTestId('opener').querySelectorAll('li')).toHaveLength(hero.run.results.length)

    // The run ends on its own and wipes away.
    act(() => vi.advanceTimersByTime(2000))
    expect(screen.queryByTestId('opener')).not.toBeInTheDocument()
    expect(root).not.toHaveClass('intro')
    expect(root).toHaveClass('play')
    expect(sessionStorage.getItem(INTRO_SEEN_KEY)).toBe('1')
    expect(onDone).toHaveBeenCalledTimes(1)
    window.removeEventListener(OPENER_DONE_EVENT, onDone)
  })

  it('skips straight to the hand-off on any key', () => {
    root.classList.add('intro')
    render(<Opener />)

    act(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }))
    })
    act(() => vi.advanceTimersByTime(820))

    expect(screen.queryByTestId('opener')).not.toBeInTheDocument()
    expect(sessionStorage.getItem(INTRO_SEEN_KEY)).toBe('1')
  })

  it('is hidden from assistive tech while it plays', () => {
    root.classList.add('intro')
    render(<Opener />)
    expect(screen.getByTestId('opener')).toHaveAttribute('aria-hidden', 'true')
  })
})
