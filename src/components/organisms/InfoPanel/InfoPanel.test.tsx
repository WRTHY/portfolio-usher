import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import InfoPanel from './InfoPanel'
import { sections } from '../../../content/navigation'
import { siteContent } from '../../../content/site'

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

describe('InfoPanel', () => {
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

  it('is hidden from the accessibility tree while the hero section is active', () => {
    render(<InfoPanel />)
    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })

  it('shows the name, tagline, and the active section’s own label and description', () => {
    render(<InfoPanel />)
    activateSection('case-studies')

    const caseStudies = sections.find((section) => section.id === 'case-studies')!

    expect(screen.getByRole('complementary', { name: 'Page summary' })).toBeInTheDocument()
    expect(screen.getByText(siteContent.name)).toBeInTheDocument()
    expect(screen.getByText(siteContent.tagline)).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 2, name: caseStudies.label }),
    ).toBeInTheDocument()
    expect(screen.getByText(caseStudies.description)).toBeInTheDocument()
  })

  it('swaps in the new section’s own content as the active section changes', () => {
    render(<InfoPanel />)
    activateSection('case-studies')
    activateSection('about', 1)

    const about = sections.find((section) => section.id === 'about')!
    const caseStudies = sections.find((section) => section.id === 'case-studies')!

    expect(screen.getByRole('heading', { level: 2, name: about.label })).toBeInTheDocument()
    expect(screen.queryByText(caseStudies.description)).not.toBeInTheDocument()
  })

  it('hides again when scrolling back to the hero, keeping the last section’s wording underneath', () => {
    render(<InfoPanel />)
    activateSection('case-studies')
    activateSection('hero', 1)

    const caseStudies = sections.find((section) => section.id === 'case-studies')!

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
    expect(screen.getByText(caseStudies.description)).toBeInTheDocument()
  })
})
