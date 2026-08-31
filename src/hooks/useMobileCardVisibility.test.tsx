import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useMobileCardVisibility from './useMobileCardVisibility'

function TestTarget({ activeId, threshold }: { activeId: string; threshold: number }) {
  const { visible, eased } = useMobileCardVisibility(activeId, threshold, 150)
  return (
    <div data-testid="target">
      {visible ? 'visible' : 'hidden'}/{eased ? 'eased' : 'instant'}
    </div>
  )
}

function scrollTo(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value })
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}

describe('useMobileCardVisibility', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('is visible before any scrolling', () => {
    scrollTo(0)
    render(<TestTarget activeId="about" threshold={120} />)
    expect(screen.getByTestId('target')).toHaveTextContent('visible/instant')
  })

  it('hides while actively scrolling down past the threshold', () => {
    scrollTo(0)
    render(<TestTarget activeId="about" threshold={120} />)

    scrollTo(300)
    expect(screen.getByTestId('target')).toHaveTextContent('hidden/instant')
  })

  it('reappears eased on an upward scroll', () => {
    scrollTo(0)
    render(<TestTarget activeId="about" threshold={120} />)

    scrollTo(300)
    expect(screen.getByTestId('target')).toHaveTextContent('hidden/instant')

    scrollTo(280)
    expect(screen.getByTestId('target')).toHaveTextContent('visible/eased')
  })

  it('stays visible within the near-top threshold regardless of direction', () => {
    scrollTo(300)
    render(<TestTarget activeId="about" threshold={120} />)

    scrollTo(310)
    expect(screen.getByTestId('target')).toHaveTextContent('hidden/instant')

    scrollTo(50)
    expect(screen.getByTestId('target')).toHaveTextContent('visible/eased')
  })

  it('stays hidden until scrolling settles on a new section, then reveals instantly', () => {
    scrollTo(0)
    const { rerender } = render(<TestTarget activeId="about" threshold={120} />)

    scrollTo(400)
    expect(screen.getByTestId('target')).toHaveTextContent('hidden/instant')

    // The section changes mid-scroll (IntersectionObserver can report it
    // before scroll-snap's own glide has actually finished) — should stay
    // hidden until things actually settle.
    rerender(<TestTarget activeId="experience" threshold={120} />)
    expect(screen.getByTestId('target')).toHaveTextContent('hidden/instant')

    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByTestId('target')).toHaveTextContent('visible/instant')
  })

  it('does not re-reveal (or blink) if trailing scroll events keep arriving after the section change', () => {
    scrollTo(0)
    const { rerender } = render(<TestTarget activeId="about" threshold={120} />)

    scrollTo(400)
    rerender(<TestTarget activeId="experience" threshold={120} />)

    // Simulates scroll-snap's snap-correction continuing to fire 'scroll'
    // events after the section already changed — each one should push the
    // settle check back rather than letting a stale timer reveal (and then
    // immediately re-hide) the card while movement is still ongoing.
    act(() => {
      vi.advanceTimersByTime(100)
    })
    scrollTo(410)
    act(() => {
      vi.advanceTimersByTime(100)
    })
    expect(screen.getByTestId('target')).toHaveTextContent('hidden/instant')

    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByTestId('target')).toHaveTextContent('visible/instant')
  })

  it('stays revealed after settling on a new section — it is not hidden again by a timeout', () => {
    scrollTo(0)
    const { rerender } = render(<TestTarget activeId="about" threshold={120} />)

    scrollTo(400)
    rerender(<TestTarget activeId="experience" threshold={120} />)
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByTestId('target')).toHaveTextContent('visible/instant')

    // No further scrolling — a fixed auto-hide timer previously cleared
    // the reveal here regardless, causing a blink back out with no user
    // input at all.
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('target')).toHaveTextContent('visible/instant')
  })

  it('stays revealed through a small downward snap-correction after an upward scroll', () => {
    scrollTo(400)
    render(<TestTarget activeId="experience" threshold={120} />)

    scrollTo(300)
    expect(screen.getByTestId('target')).toHaveTextContent('visible/eased')

    // Scroll-snap settling into place can fire one last trailing event a
    // few px in the opposite direction of the actual gesture — that alone
    // shouldn't flip the card back to hidden.
    scrollTo(304)
    expect(screen.getByTestId('target')).toHaveTextContent('visible/eased')
  })

  it('does not re-reveal on further scrolling within the same (already-revealed) section', () => {
    scrollTo(0)
    const { rerender } = render(<TestTarget activeId="about" threshold={120} />)

    scrollTo(400)
    rerender(<TestTarget activeId="experience" threshold={120} />)
    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByTestId('target')).toHaveTextContent('visible/instant')

    // Continuing to scroll down within the same section should hide it
    // again like normal — the settle-reveal shouldn't keep forcing it
    // back open.
    scrollTo(600)
    expect(screen.getByTestId('target')).toHaveTextContent('hidden/instant')

    act(() => {
      vi.advanceTimersByTime(150)
    })
    expect(screen.getByTestId('target')).toHaveTextContent('hidden/instant')
  })
})
