import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import useActiveSection from './useActiveSection'
import { sections } from '../content/navigation'

type Entry = { target: Element; intersectionRatio: number }

let capturedCallback: ((entries: Entry[]) => void) | null = null

class ObserverStub implements IntersectionObserver {
  readonly root = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor(callback: IntersectionObserverCallback) {
    capturedCallback = callback as unknown as (entries: Entry[]) => void
  }

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

function TestComponent() {
  const activeId = useActiveSection()
  return <div data-testid="active">{activeId}</div>
}

describe('useActiveSection', () => {
  beforeEach(() => {
    capturedCallback = null
    window.IntersectionObserver = ObserverStub

    sections.forEach((section) => {
      const el = document.createElement('div')
      el.id = section.id
      document.body.appendChild(el)
    })
  })

  afterEach(() => {
    sections.forEach((section) => {
      document.getElementById(section.id)?.remove()
    })
  })

  it('defaults to the first section before anything is observed', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('active')).toHaveTextContent(sections[0].id)
  })

  it('switches to whichever section currently has the highest intersection ratio', () => {
    render(<TestComponent />)
    const target = document.getElementById(sections[1].id)!

    act(() => {
      capturedCallback?.([{ target, intersectionRatio: 0.9 }])
    })

    expect(screen.getByTestId('active')).toHaveTextContent(sections[1].id)
  })

  it('keeps the last-known-best section when a later batch reports nothing intersecting', () => {
    // Reproduces the actual bug: IntersectionObserver only reports entries
    // whose state changed in a given batch. If the outgoing section reports
    // ratio 0 in its own batch (before the incoming section's crossing is
    // reported), naively trusting only "this batch" would leave nothing
    // active. The hook should keep the best ratio seen so far instead.
    render(<TestComponent />)
    const incoming = document.getElementById(sections[1].id)!
    const outgoing = document.getElementById(sections[0].id)!

    act(() => {
      capturedCallback?.([{ target: incoming, intersectionRatio: 0.9 }])
    })
    act(() => {
      capturedCallback?.([{ target: outgoing, intersectionRatio: 0 }])
    })

    expect(screen.getByTestId('active')).toHaveTextContent(sections[1].id)
  })
})
