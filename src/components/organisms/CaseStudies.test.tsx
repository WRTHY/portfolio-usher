import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import CaseStudies from './CaseStudies'
import { caseStudies } from '../../content/caseStudies'

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
  })

  it('closes the modal when the close button is clicked', async () => {
    const user = userEvent.setup()
    render(<CaseStudies />)

    const first = caseStudies[0]
    await user.click(screen.getByRole('button', { name: new RegExp(first.title) }))
    await user.click(screen.getByRole('button', { name: 'Close' }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
