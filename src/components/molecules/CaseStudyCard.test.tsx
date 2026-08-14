import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import CaseStudyCard from './CaseStudyCard'
import type { CaseStudy } from '../../content/caseStudies'

const caseStudy: CaseStudy = {
  id: 'test-case',
  title: 'Test case study',
  summary: 'A short summary.',
  tags: ['Playwright', 'CI/CD'],
  problem: 'The problem.',
  approach: 'The approach.',
  outcome: 'The outcome.',
}

describe('CaseStudyCard', () => {
  it('renders the title, summary, and tags', () => {
    render(<CaseStudyCard caseStudy={caseStudy} onSelect={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Test case study' })).toBeInTheDocument()
    expect(screen.getByText('A short summary.')).toBeInTheDocument()
    expect(screen.getByText('Playwright')).toBeInTheDocument()
    expect(screen.getByText('CI/CD')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    render(<CaseStudyCard caseStudy={caseStudy} onSelect={handleSelect} />)

    await user.click(screen.getByRole('button'))

    expect(handleSelect).toHaveBeenCalledTimes(1)
  })
})
