import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import useOverscrollBump from './useOverscrollBump'

function TestTarget() {
  const ref = useOverscrollBump<HTMLDivElement>()
  return <div data-testid="target" ref={ref} />
}

function setScrollPosition({
  scrollHeight,
  innerHeight,
  scrollY,
}: {
  scrollHeight: number
  innerHeight: number
  scrollY: number
}) {
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  })
  Object.defineProperty(window, 'innerHeight', { configurable: true, value: innerHeight })
  Object.defineProperty(window, 'scrollY', { configurable: true, value: scrollY })
}

describe('useOverscrollBump', () => {
  it('adds a bump class when scrolling down past the bottom boundary', () => {
    setScrollPosition({ scrollHeight: 1000, innerHeight: 800, scrollY: 200 })

    render(<TestTarget />)
    const target = screen.getByTestId('target')

    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 10 }))
    expect(target).toHaveClass('bump')
  })

  it('removes the bump class once the CSS animation finishes', () => {
    // jsdom doesn't run real CSS animations, so animationend never fires on
    // its own — dispatching it directly simulates what the browser does
    // when the animation genuinely completes.
    setScrollPosition({ scrollHeight: 1000, innerHeight: 800, scrollY: 200 })

    render(<TestTarget />)
    const target = screen.getByTestId('target')

    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 10 }))
    expect(target).toHaveClass('bump')

    target.dispatchEvent(new Event('animationend'))
    expect(target).not.toHaveClass('bump')
  })

  it('does nothing when not yet at the bottom of the page', () => {
    setScrollPosition({ scrollHeight: 2000, innerHeight: 800, scrollY: 200 })

    render(<TestTarget />)
    const target = screen.getByTestId('target')

    window.dispatchEvent(new WheelEvent('wheel', { deltaY: 10 }))
    expect(target).not.toHaveClass('bump')
  })

  it('does nothing when scrolling back up at the bottom boundary', () => {
    setScrollPosition({ scrollHeight: 1000, innerHeight: 800, scrollY: 200 })

    render(<TestTarget />)
    const target = screen.getByTestId('target')

    window.dispatchEvent(new WheelEvent('wheel', { deltaY: -10 }))
    expect(target).not.toHaveClass('bump')
  })
})
