import { act, render, screen, within } from '@testing-library/react'
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

  it('shows the name, tagline, and page nav, with the active section marked', () => {
    render(<InfoPanel />)
    activateSection('case-studies')

    expect(screen.getByRole('complementary', { name: 'Page summary' })).toBeInTheDocument()
    expect(screen.getByText(siteContent.name)).toBeInTheDocument()
    expect(screen.getByText(siteContent.tagline)).toBeInTheDocument()

    const nav = screen.getByRole('navigation', { name: 'Sections' })
    sections.forEach((section) => {
      expect(within(nav).getByRole('link', { name: section.label })).toBeInTheDocument()
    })
    expect(within(nav).getByRole('link', { name: 'Case Studies' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('marks the new section as active in the nav as the active section changes', () => {
    render(<InfoPanel />)
    activateSection('case-studies')
    activateSection('about', 1)

    const nav = screen.getByRole('navigation', { name: 'Sections' })
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
    expect(within(nav).getByRole('link', { name: 'Case Studies' })).not.toHaveAttribute('aria-current')
  })

  it('hides again when scrolling back to the hero', () => {
    render(<InfoPanel />)
    activateSection('case-studies')
    activateSection('hero', 1)

    expect(screen.queryByRole('complementary')).not.toBeInTheDocument()
  })
})
