import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import CaseStudies from './CaseStudies'
import { caseStudies } from '../../../content/caseStudies'

// Content fields can be multi-paragraph strings whose whitespace the page
// collapses, so compare text with whitespace normalized on both sides.
const normalize = (text: string | null) => (text ?? '').replace(/\s+/g, ' ').trim()

const rowFor = (id: string) => screen.getByTestId(`case-study-${id}`)
const toggleFor = (id: string) => within(rowFor(id)).getByRole('button', { name: /^Read case study:/ })
const writeUpFor = (id: string) => screen.getByTestId(`case-study-write-up-${id}`)

describe('CaseStudies', () => {
  it('is the region named by its heading', () => {
    render(<CaseStudies />)
    expect(screen.getByRole('region', { name: 'Case Studies' })).toHaveAttribute('id', 'case-studies')
  })

  it('lists one row per case study, in order', () => {
    render(<CaseStudies />)
    const titles = screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent)
    expect(titles).toEqual(caseStudies.map((caseStudy) => caseStudy.title))
  })

  it.each(caseStudies.map((caseStudy) => [caseStudy.id, caseStudy] as const))(
    '%s leads with its outcome and topics, with the write-up waiting behind the "+"',
    (id, caseStudy) => {
      render(<CaseStudies />)
      const row = rowFor(id)
      const [headline] = caseStudy.highlights
      expect(within(row).getByText(headline.value)).toBeVisible()
      expect(within(row).getByText(headline.label)).toBeVisible()

      const topics = within(row).getByRole('list', { name: `Topics: ${caseStudy.title}` })
      expect(within(topics).getAllByRole('listitem').map((item) => item.textContent).sort()).toEqual(
        [...caseStudy.tags].sort(),
      )

      expect(toggleFor(id)).toHaveAttribute('aria-expanded', 'false')
      expect(writeUpFor(id)).not.toBeVisible()
    },
  )

  it.each(caseStudies.map((caseStudy) => [caseStudy.id, caseStudy] as const))(
    '%s opens its full write-up in place with the "+", and closes again',
    async (id, caseStudy) => {
      const user = userEvent.setup()
      render(<CaseStudies />)

      await user.click(toggleFor(id))

      expect(toggleFor(id)).toHaveAttribute('aria-expanded', 'true')
      const writeUp = writeUpFor(id)
      expect(writeUp).toBeVisible()
      expect(within(writeUp).getByText(normalize(caseStudy.summary))).toBeVisible()

      const parts = within(writeUp)
        .getAllByRole('heading', { level: 4 })
        .map((heading) => heading.textContent)
      const expected = ['Problem', 'Approach', 'Outcome', ...(caseStudy.futureIterations ? ['Future iterations'] : [])]
      expect(parts.filter((part) => part !== 'The framework, phase by phase')).toEqual(expected)
      expect(normalize(within(writeUp).getByTestId('case-study-part-outcome').textContent)).toContain(
        normalize(caseStudy.outcome),
      )

      // Any figures past the headline sit beside the write-up once open.
      const [, ...figures] = caseStudy.highlights
      figures.forEach(({ value }) => expect(within(rowFor(id)).getByText(value)).toBeVisible())

      await user.click(toggleFor(id))
      expect(writeUpFor(id)).not.toBeVisible()
    },
  )

  it('opens CS 1 on its phases, in order', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    const [framework] = caseStudies
    await user.click(toggleFor(framework.id))

    const phases = within(writeUpFor(framework.id)).getByRole('list', { name: 'The framework, phase by phase' })
    expect(within(phases).getAllByRole('listitem').map((item) => item.firstChild?.textContent)).toEqual(
      framework.phases?.map((phase) => phase.name),
    )
  })

  it('opens case studies independently', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    const [first, second] = caseStudies
    await user.click(toggleFor(first.id))

    expect(writeUpFor(first.id)).toBeVisible()
    expect(writeUpFor(second.id)).not.toBeVisible()
  })

  it('opens from a click anywhere on the row, and leaves an open write-up alone when clicked', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    const [caseStudy] = caseStudies

    await user.click(within(rowFor(caseStudy.id)).getByText(caseStudy.highlights[0].label))
    expect(toggleFor(caseStudy.id)).toHaveAttribute('aria-expanded', 'true')

    await user.click(within(writeUpFor(caseStudy.id)).getByText(normalize(caseStudy.summary)))
    expect(toggleFor(caseStudy.id)).toHaveAttribute('aria-expanded', 'true')
  })

  it('closes from the end of the write-up and hands focus back to the "+"', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    const [caseStudy] = caseStudies
    await user.click(toggleFor(caseStudy.id))

    await user.click(within(writeUpFor(caseStudy.id)).getByRole('button', { name: 'Close case study' }))

    expect(writeUpFor(caseStudy.id)).not.toBeVisible()
    expect(toggleFor(caseStudy.id)).toHaveFocus()
  })

  it('opens and closes from the keyboard', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    const [caseStudy] = caseStudies
    toggleFor(caseStudy.id).focus()

    await user.keyboard('{Enter}')
    expect(writeUpFor(caseStudy.id)).toBeVisible()

    await user.keyboard(' ')
    expect(writeUpFor(caseStudy.id)).not.toBeVisible()
  })

  it('lifts a row while the pointer is over it', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)
    const [caseStudy] = caseStudies

    await user.hover(within(rowFor(caseStudy.id)).getByText(caseStudy.title))
    expect(rowFor(caseStudy.id)).toHaveAttribute('data-highlighted', 'true')

    await user.unhover(within(rowFor(caseStudy.id)).getByText(caseStudy.title))
    expect(rowFor(caseStudy.id)).not.toHaveAttribute('data-highlighted')
  })
})
