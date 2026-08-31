import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import usePrefersReducedMotion from './usePrefersReducedMotion'

type Listener = () => void

class MediaQueryListStub {
  matches: boolean
  media = '(prefers-reduced-motion: reduce)'
  private listeners: Listener[] = []

  constructor(matches: boolean) {
    this.matches = matches
  }

  addEventListener(_type: string, listener: Listener) {
    this.listeners.push(listener)
  }

  removeEventListener(_type: string, listener: Listener) {
    this.listeners = this.listeners.filter((l) => l !== listener)
  }

  setMatches(matches: boolean) {
    this.matches = matches
    this.listeners.forEach((listener) => listener())
  }
}

let stub: MediaQueryListStub

function TestComponent() {
  const prefersReducedMotion = usePrefersReducedMotion()
  return <div data-testid="value">{String(prefersReducedMotion)}</div>
}

describe('usePrefersReducedMotion', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    stub = new MediaQueryListStub(false)
    window.matchMedia = () => stub as unknown as MediaQueryList
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('reflects the current matchMedia value on mount', () => {
    stub.matches = true
    render(<TestComponent />)
    expect(screen.getByTestId('value')).toHaveTextContent('true')
  })

  it('updates when the OS-level setting changes', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('value')).toHaveTextContent('false')

    act(() => {
      stub.setMatches(true)
    })

    expect(screen.getByTestId('value')).toHaveTextContent('true')
  })
})
