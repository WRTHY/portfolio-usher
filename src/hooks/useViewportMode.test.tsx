import { render, screen } from '@testing-library/react'
import { act } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import useViewportMode from './useViewportMode'

type Listener = () => void

// A stubbed MediaQueryList whose `matches` can be flipped from the test to
// simulate the viewport crossing the query's boundary (e.g. rotating a
// phone), firing every listener registered via addEventListener the way a
// real one fires 'change'.
function createMatchMedia(initialMatches: boolean) {
  let matches = initialMatches
  const listeners: Listener[] = []
  const mql = {
    get matches() {
      return matches
    },
    media: '',
    addEventListener: (_: string, listener: Listener) => listeners.push(listener),
    removeEventListener: (_: string, listener: Listener) => {
      const index = listeners.indexOf(listener)
      if (index !== -1) listeners.splice(index, 1)
    },
    dispatchEvent: () => false,
  } as unknown as MediaQueryList

  return {
    mql,
    setMatches(next: boolean) {
      matches = next
      listeners.forEach((listener) => listener())
    },
  }
}

function TestTarget() {
  const mode = useViewportMode()
  return <div data-testid="target">{mode}</div>
}

describe('useViewportMode', () => {
  afterEach(() => {
    delete document.documentElement.dataset.viewport
    vi.unstubAllGlobals()
  })

  it('reports desktop and sets the attribute when the mobile query does not match', () => {
    const { mql } = createMatchMedia(false)
    vi.stubGlobal('matchMedia', () => mql)

    render(<TestTarget />)

    expect(screen.getByTestId('target')).toHaveTextContent('desktop')
    expect(document.documentElement.dataset.viewport).toBe('desktop')
  })

  it('reports mobile and sets the attribute when the mobile query matches', () => {
    const { mql } = createMatchMedia(true)
    vi.stubGlobal('matchMedia', () => mql)

    render(<TestTarget />)

    expect(screen.getByTestId('target')).toHaveTextContent('mobile')
    expect(document.documentElement.dataset.viewport).toBe('mobile')
  })

  it('updates on a landscape rotation crossing the short-height threshold', () => {
    const { mql, setMatches } = createMatchMedia(false)
    vi.stubGlobal('matchMedia', () => mql)

    render(<TestTarget />)
    expect(screen.getByTestId('target')).toHaveTextContent('desktop')

    act(() => {
      setMatches(true)
    })

    expect(screen.getByTestId('target')).toHaveTextContent('mobile')
    expect(document.documentElement.dataset.viewport).toBe('mobile')
  })
})
