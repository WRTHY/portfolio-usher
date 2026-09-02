import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import useActiveSectionInfo from './useActiveSectionInfo'
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

function activateSection(id: string, ratio = 0.9) {
  const target = document.getElementById(id)!
  act(() => {
    capturedCallback?.([{ target, intersectionRatio: ratio }])
  })
}

function TestComponent() {
  const { activeId, activeIndex, activeSection } = useActiveSectionInfo()
  return (
    <div data-testid="active">
      {activeId}/{activeIndex}/{activeSection?.label}
    </div>
  )
}

describe('useActiveSectionInfo', () => {
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

  it('resolves the full section object for the default (first) section', () => {
    render(<TestComponent />)
    expect(screen.getByTestId('active')).toHaveTextContent(
      `${sections[0].id}/0/${sections[0].label}`,
    )
  })

  it('resolves the full section object as the active section changes', () => {
    render(<TestComponent />)

    activateSection('api-testing')

    const apiTestingIndex = sections.findIndex((section) => section.id === 'api-testing')
    expect(screen.getByTestId('active')).toHaveTextContent(
      `api-testing/${apiTestingIndex}/API Testing`,
    )
  })
})
