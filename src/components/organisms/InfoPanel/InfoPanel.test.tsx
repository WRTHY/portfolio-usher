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

  it('is visible from the first section onward', () => {
    render(<InfoPanel />)
    expect(screen.getByRole('complementary', { name: 'Page summary' })).toBeInTheDocument()
  })

  it('shows the name, tagline, page nav, and resume link, with the active section marked', () => {
    render(<InfoPanel />)
    activateSection('case-studies')

    expect(screen.getByRole('complementary', { name: 'Page summary' })).toBeInTheDocument()
    expect(screen.getByText(siteContent.name)).toBeInTheDocument()
    expect(screen.getByText(siteContent.tagline)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'My Resume' })).toHaveAttribute(
      'href',
      siteContent.resumeUrl,
    )

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
    activateSection('experience', 1)

    const nav = screen.getByRole('navigation', { name: 'Sections' })
    expect(within(nav).getByRole('link', { name: 'Experience' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Case Studies' })).not.toHaveAttribute('aria-current')
  })

  it('marks the first section as active again when scrolling back to it', () => {
    render(<InfoPanel />)
    activateSection('case-studies')
    activateSection('about', 1)

    const nav = screen.getByRole('navigation', { name: 'Sections' })
    expect(within(nav).getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page')
  })

  it('contrasts its background against the active section\'s tone', () => {
    render(<InfoPanel />)
    const panel = screen.getByRole('complementary', { name: 'Page summary' })

    activateSection('about', 1)
    expect(panel).toHaveStyle({ '--panel-bg': 'var(--section-alt-bg)' })

    // Zero out the outgoing section's ratio first, as a real observer
    // callback would report once it's scrolled out of view — otherwise a
    // tied ratio just keeps the earlier section active.
    activateSection('about', 0)
    activateSection('experience', 1)
    expect(panel).toHaveStyle({ '--panel-bg': 'var(--bg)' })

    activateSection('experience', 0)
    activateSection('case-studies', 1)
    expect(panel).toHaveStyle({ '--panel-bg': 'var(--section-alt-bg)' })

    activateSection('case-studies', 0)
    activateSection('code-samples', 1)
    expect(panel).toHaveStyle({ '--panel-bg': 'var(--bg)' })
  })
})
