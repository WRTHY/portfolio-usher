import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CaseStudies from './CaseStudies'
import { caseStudies } from '../../../content/caseStudies'
import styles from './CaseStudies.module.css'

// jsdom never lays anything out, so a section's real offsetTop/offsetHeight
// and the pane's real scrollHeight/clientHeight are all 0 by default — stub
// a synthetic layout so useReadingRail's boundary math (see CaseStudies.tsx)
// has real geometry to scale against. Chosen to mirror the shape of the bug
// being guarded against: Approach is much taller than Outcome, and Outcome
// plus Future Iterations together are shorter than one pane height — so a
// naive "scroll this section's top to a fixed line near the pane's top"
// approach could never bring Outcome's own top near that line before the
// pane ran out of room to scroll, permanently skipping it.
function stubReadingRailLayout(contentPane: Element) {
  Object.defineProperty(contentPane, 'scrollHeight', { value: 850, configurable: true })
  Object.defineProperty(contentPane, 'clientHeight', { value: 500, configurable: true })
  ;(
    [
      ['case-study-section-problem', 0, 100],
      ['case-study-section-approach', 100, 400],
      ['case-study-section-outcome', 524, 100],
      ['case-study-section-futureIterations', 648, 150],
    ] as const
  ).forEach(([testId, offsetTop, height]) => {
    const el = screen.queryByTestId(testId)
    if (!el) return
    Object.defineProperty(el, 'offsetTop', { value: offsetTop, configurable: true })
    Object.defineProperty(el, 'offsetHeight', { value: height, configurable: true })
  })
}

// DRY note: content fields can be multi-paragraph template literals with
// embedded indentation/newlines that the browser collapses visually but
// that don't match a testing-library element's normalized textContent
// verbatim. Normalizing both sides the same way keeps assertions robust
// to how a field happens to be formatted in caseStudies.ts.
//
// Blank-line-separated paragraphs render as separate <p> elements (see
// the Paragraphs component in CaseStudies.tsx), and jsdom's textContent
// concatenates adjacent elements with no separator — so paragraph breaks
// collapse to nothing here rather than to a space, matching the DOM.
const normalizeWhitespace = (text: string) =>
  text
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .join('')

describe('CaseStudies', () => {
  it('renders a card for every case study', () => {
    render(<CaseStudies />)
    caseStudies.forEach((caseStudy) => {
      expect(screen.getByTestId(`case-study-card-${caseStudy.id}`)).toBeInTheDocument()
    })
  })

  it('opens a detail modal with the full report when a card is clicked', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)

    const first = caseStudies[0]
    await user.click(screen.getByTestId(`case-study-card-${first.id}`))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(screen.getByTestId('case-study-section-problem')).toHaveTextContent(
      normalizeWhitespace(first.problem),
    )
    expect(screen.getByTestId('case-study-section-approach')).toHaveTextContent(
      normalizeWhitespace(first.approach),
    )
    expect(screen.getByTestId('case-study-section-outcome')).toHaveTextContent(
      normalizeWhitespace(first.outcome),
    )
    if (first.futureIterations) {
      expect(screen.getByTestId('case-study-section-futureIterations')).toHaveTextContent(
        normalizeWhitespace(first.futureIterations),
      )
    }
  })

  it('closes the modal when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)

    const first = caseStudies[0]
    await user.click(screen.getByTestId(`case-study-card-${first.id}`))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the Future Iterations section only for case studies that have it', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)

    const withFuture = caseStudies.find((caseStudy) => caseStudy.futureIterations)
    const withoutFuture = caseStudies.find((caseStudy) => !caseStudy.futureIterations)
    expect(withFuture).toBeDefined()

    await user.click(screen.getByTestId(`case-study-card-${withFuture!.id}`))
    expect(screen.getByRole('heading', { name: 'Future iterations' })).toBeInTheDocument()
    expect(screen.getByTestId('case-study-section-futureIterations')).toHaveTextContent(
      normalizeWhitespace(withFuture!.futureIterations!),
    )
    expect(screen.getByRole('button', { name: 'Future iterations' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close' }))

    // All current case studies (including the unwritten placeholders) carry
    // futureIterations text, so there's no "without" case to click through
    // right now. Once real case studies replace the placeholders this guard
    // will start exercising the negative path again without any test change.
    if (withoutFuture) {
      await user.click(screen.getByTestId(`case-study-card-${withoutFuture.id}`))
      expect(screen.queryByRole('heading', { name: 'Future iterations' })).not.toBeInTheDocument()
      expect(screen.queryByTestId('case-study-section-futureIterations')).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: 'Future iterations' })).not.toBeInTheDocument()
    }
  })

  describe('reading rail nav', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it('scrolls to the clicked section and marks it active once the pane reports that scroll position', async () => {
      const scrollTo = vi.fn()
      Element.prototype.scrollTo = scrollTo

      const user = userEvent.setup()
      render(<CaseStudies />)

      const withFuture = caseStudies.find((caseStudy) => caseStudy.futureIterations)!
      await user.click(screen.getByTestId(`case-study-card-${withFuture.id}`))

      const contentPane = document.querySelector(`.${styles.content}`)!
      stubReadingRailLayout(contentPane)

      const approachNavItem = screen.getByRole('button', { name: 'Approach' })
      expect(approachNavItem).not.toHaveClass(styles.navItemActive)

      await user.click(approachNavItem)

      // Approach's boundary is its own offsetTop (100) rescaled into the
      // pane's actual scrollable range (maxScroll 350 over a 648px span):
      // 100 * (350 / 648) ≈ 54.
      expect(scrollTo).toHaveBeenCalledTimes(1)
      const [{ top, behavior }] = scrollTo.mock.calls[0]
      expect(top).toBeCloseTo(54, 0)
      expect(behavior).toBe('smooth')

      contentPane.scrollTop = top
      act(() => {
        contentPane.dispatchEvent(new Event('scroll'))
      })

      expect(approachNavItem).toHaveClass(styles.navItemActive)
    })

    it('marks a short section active on its own, without the taller section above it hogging the highlight', async () => {
      Element.prototype.scrollTo = vi.fn()

      const user = userEvent.setup()
      render(<CaseStudies />)

      const withFuture = caseStudies.find((caseStudy) => caseStudy.futureIterations)!
      await user.click(screen.getByTestId(`case-study-card-${withFuture.id}`))

      const contentPane = document.querySelector(`.${styles.content}`)!
      stubReadingRailLayout(contentPane)

      // Outcome's boundary (≈283) sits well short of maxScroll (350) even
      // though Outcome itself is far shorter than Approach — this is the
      // exact case that used to leave Outcome permanently skipped, since a
      // fixed reading-line offset could never bring its own short top this
      // close to the pane's top before the pane ran out of room to scroll.
      contentPane.scrollTop = 300
      act(() => {
        contentPane.dispatchEvent(new Event('scroll'))
      })

      expect(screen.getByRole('button', { name: 'Outcome' })).toHaveClass(styles.navItemActive)
      expect(screen.getByRole('button', { name: 'Approach' })).not.toHaveClass(
        styles.navItemActive,
      )
      expect(screen.getByRole('button', { name: 'Future iterations' })).not.toHaveClass(
        styles.navItemActive,
      )
    })

    it('marks the last section active once scrolled to the very bottom of the pane', async () => {
      Element.prototype.scrollTo = vi.fn()

      const user = userEvent.setup()
      render(<CaseStudies />)

      const withFuture = caseStudies.find((caseStudy) => caseStudy.futureIterations)!
      await user.click(screen.getByTestId(`case-study-card-${withFuture.id}`))

      const contentPane = document.querySelector(`.${styles.content}`)!
      stubReadingRailLayout(contentPane)

      contentPane.scrollTop = 350 // maxScroll: scrollHeight (850) - clientHeight (500)
      act(() => {
        contentPane.dispatchEvent(new Event('scroll'))
      })

      expect(screen.getByRole('button', { name: 'Future iterations' })).toHaveClass(
        styles.navItemActive,
      )
    })

    it('is active on Problem when the modal first opens', async () => {
      const user = userEvent.setup()
      render(<CaseStudies />)

      const first = caseStudies[0]
      await user.click(screen.getByTestId(`case-study-card-${first.id}`))

      expect(screen.getByRole('button', { name: 'Problem' })).toHaveClass(styles.navItemActive)
      expect(screen.getByRole('button', { name: 'Approach' })).not.toHaveClass(
        styles.navItemActive,
      )
    })
  })
})
