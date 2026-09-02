import { StrictMode } from 'react'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import MobileInfoCard from './MobileInfoCard'
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

function scrollTo(value: number) {
  Object.defineProperty(window, 'scrollY', { configurable: true, value })
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}

function settle() {
  act(() => {
    vi.advanceTimersByTime(150)
  })
}

describe('MobileInfoCard', () => {
  beforeEach(() => {
    vi.useFakeTimers()
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
    vi.useRealTimers()
  })

  it('shows the name and current section near the top of the page', () => {
    scrollTo(0)
    render(<MobileInfoCard />)

    const card = screen.getByTestId('mobile-info-card')
    expect(card).toHaveAttribute('aria-label', 'Page summary')
    expect(card).toHaveAttribute('aria-hidden', 'false')
    expect(screen.getByText(sections[0].label)).toBeInTheDocument()
    expect(screen.getByText(siteContent.name)).toBeInTheDocument()
  })

  // role (tagline) and quickSummary both moved to the hamburger menu (see
  // Nav.tsx) to keep this card to just identity + "which section" —
  // regression-proof that neither creeps back in here.
  it('does not show the role or quickSummary — those live in the hamburger menu instead', () => {
    scrollTo(0)
    render(<MobileInfoCard />)
    expect(screen.queryByText(siteContent.tagline)).not.toBeInTheDocument()
    expect(screen.queryByText(siteContent.quickSummary)).not.toBeInTheDocument()
  })

  it('hides while actively scrolling down, away from the top', () => {
    scrollTo(0)
    render(<MobileInfoCard />)

    scrollTo(400)
    expect(screen.getByTestId('mobile-info-card')).toHaveAttribute('aria-hidden', 'true')
  })

  it('eases back in when scrolling back up', () => {
    scrollTo(0)
    render(<MobileInfoCard />)

    scrollTo(400)
    expect(screen.getByTestId('mobile-info-card')).toHaveAttribute('aria-hidden', 'true')

    scrollTo(380)
    const card = screen.getByTestId('mobile-info-card')
    expect(card).toHaveAttribute('aria-hidden', 'false')
    expect(card.className).toMatch(/cardEased/)
  })

  it('stays hidden while a section change is still mid-scroll, and only appears once scrolling settles', () => {
    scrollTo(0)
    render(<MobileInfoCard />)

    scrollTo(400)
    expect(screen.getByTestId('mobile-info-card')).toHaveAttribute('aria-hidden', 'true')

    // IntersectionObserver can report the new section before scroll-snap's
    // own glide into place — and any snap-correction after it — has
    // actually finished. The card should stay hidden through that, not
    // pop in ahead of the section's blank space and then blink back out
    // once trailing scroll events resume.
    activateSection('experience')
    expect(screen.getByTestId('mobile-info-card')).toHaveAttribute('aria-hidden', 'true')

    settle()
    const card = screen.getByTestId('mobile-info-card')
    expect(card).toHaveAttribute('aria-hidden', 'false')
    expect(card.className).not.toMatch(/cardEased/)
    expect(screen.getByText('Experience')).toBeInTheDocument()
  })

  it('stays revealed after settling on a new section, with no auto-hide timeout', () => {
    scrollTo(0)
    render(<MobileInfoCard />)

    scrollTo(400)
    activateSection('experience')
    settle()
    expect(screen.getByTestId('mobile-info-card')).toHaveAttribute('aria-hidden', 'false')

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.getByTestId('mobile-info-card')).toHaveAttribute('aria-hidden', 'false')
  })

  it('does not re-reveal on settling within the same section', () => {
    scrollTo(0)
    render(<MobileInfoCard />)

    scrollTo(400)
    expect(screen.getByTestId('mobile-info-card')).toHaveAttribute('aria-hidden', 'true')

    settle()
    expect(screen.getByTestId('mobile-info-card')).toHaveAttribute('aria-hidden', 'true')
  })

  it('updates the section label in place as the active section changes', () => {
    scrollTo(0)
    render(<MobileInfoCard />)
    expect(screen.getByText('About')).toBeInTheDocument()

    activateSection('experience')

    expect(screen.getByText('Experience')).toBeInTheDocument()
    expect(screen.queryByText('About')).not.toBeInTheDocument()
  })

  // Regression test: the app renders this component under <StrictMode> (see
  // main.tsx), which double-invokes render and double-invokes every effect
  // once at mount. An earlier version derived the section-change reveal by
  // comparing against a ref mutated during render, which silently broke
  // under the double-render (the second pass saw the ref already updated
  // by the first, so the comparison always came out false) and meant the
  // card never actually reappeared on a real section change. Plain
  // render() below doesn't reproduce that on its own.
  it('still reveals after settling on a new section under StrictMode', () => {
    scrollTo(0)
    render(
      <StrictMode>
        <MobileInfoCard />
      </StrictMode>,
    )

    scrollTo(400)
    expect(screen.getByTestId('mobile-info-card')).toHaveAttribute('aria-hidden', 'true')

    activateSection('experience')
    settle()

    expect(screen.getByTestId('mobile-info-card')).toHaveAttribute('aria-hidden', 'false')
  })
})
