import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CaseStudies from './CaseStudies'
import { caseStudies } from '../../../content/caseStudies'
import styles from './CaseStudies.module.css'

type IntersectionEntry = { target: Element; intersectionRatio: number }

// Mirrors the stub in useActiveSection.test.tsx: captures the callback the
// component registers so a test can simulate a section entering view,
// since jsdom's own IntersectionObserver stub (see test/setup.ts) never
// fires on its own.
class ObserverStub implements IntersectionObserver {
  static capturedCallback: ((entries: IntersectionEntry[]) => void) | null = null
  readonly root = null
  readonly rootMargin = ''
  readonly scrollMargin = ''
  readonly thresholds: ReadonlyArray<number> = []

  constructor(callback: IntersectionObserverCallback) {
    ObserverStub.capturedCallback = callback as unknown as (entries: IntersectionEntry[]) => void
  }

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return []
  }
}

describe('CaseStudies', () => {
  it('renders a card for every case study', () => {
    render(<CaseStudies />)
    caseStudies.forEach((caseStudy) => {
      expect(screen.getByRole('heading', { name: caseStudy.title })).toBeInTheDocument()
    })
  })

  it('opens a detail modal with the full report when a card is clicked', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)

    const first = caseStudies[0]
    await user.click(screen.getByRole('button', { name: new RegExp(first.title) }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByText(first.problem)).toBeInTheDocument()
    expect(screen.getByText(first.approach)).toBeInTheDocument()
    expect(screen.getByText(first.outcome)).toBeInTheDocument()
    if (first.futureIterations) {
      expect(screen.getByText(first.futureIterations)).toBeInTheDocument()
    }
  })

  it('closes the modal when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)

    const first = caseStudies[0]
    await user.click(screen.getByRole('button', { name: new RegExp(first.title) }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the Future Iterations section only for case studies that have it', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)

    const withFuture = caseStudies.find((caseStudy) => caseStudy.futureIterations)
    const withoutFuture = caseStudies.find((caseStudy) => !caseStudy.futureIterations)
    expect(withFuture).toBeDefined()

    await user.click(screen.getByRole('button', { name: new RegExp(withFuture!.title) }))
    expect(screen.getByRole('heading', { name: 'Future iterations' })).toBeInTheDocument()
    expect(screen.getByText(withFuture!.futureIterations!)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Future iterations' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close' }))

    // All current case studies (including the unwritten placeholders) carry
    // futureIterations text, so there's no "without" case to click through
    // right now. Once real case studies replace the placeholders this guard
    // will start exercising the negative path again without any test change.
    if (withoutFuture) {
      await user.click(screen.getByRole('button', { name: new RegExp(withoutFuture.title) }))
      expect(screen.queryByRole('heading', { name: 'Future iterations' })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Future iterations' })).not.toBeInTheDocument()
    }
  })

  describe('reading rail nav', () => {
    afterEach(() => {
      vi.unstubAllGlobals()
    })

    it('scrolls the clicked section into view and marks it active once it enters view', async () => {
      ObserverStub.capturedCallback = null
      vi.stubGlobal('IntersectionObserver', ObserverStub)
      const scrollIntoView = vi.fn()
      Element.prototype.scrollIntoView = scrollIntoView

      const user = userEvent.setup()
      render(<CaseStudies />)

      const first = caseStudies[0]
      await user.click(screen.getByRole('button', { name: new RegExp(first.title) }))

      const approachNavItem = screen.getByRole('button', { name: 'Approach' })
      expect(approachNavItem).not.toHaveClass(styles.navItemActive)

      await user.click(approachNavItem)
      expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' })

      const approachSection = screen
        .getByRole('heading', { name: 'Approach' })
        .closest(`.${styles.section}`)!
      act(() => {
        ObserverStub.capturedCallback?.([{ target: approachSection, intersectionRatio: 0.9 }])
      })

      expect(approachNavItem).toHaveClass(styles.navItemActive)
    })

    it('is active on Problem when the modal first opens', async () => {
      const user = userEvent.setup()
      render(<CaseStudies />)

      const first = caseStudies[0]
      await user.click(screen.getByRole('button', { name: new RegExp(first.title) }))

      expect(screen.getByRole('button', { name: 'Problem' })).toHaveClass(styles.navItemActive)
      expect(screen.getByRole('button', { name: 'Approach' })).not.toHaveClass(
        styles.navItemActive,
      )
    })
  })
})
