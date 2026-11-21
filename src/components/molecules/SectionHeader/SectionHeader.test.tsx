import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SectionHeader from './SectionHeader'

describe('SectionHeader', () => {
  it('renders the title as a level-2 heading with the given id', () => {
    render(<SectionHeader id="experience-heading" title="Experience" />)
    const heading = screen.getByRole('heading', { level: 2, name: 'Experience' })
    expect(heading).toHaveAttribute('id', 'experience-heading')
  })

  it('names the section that points aria-labelledby at it', () => {
    render(
      <section aria-labelledby="cs-heading">
        <SectionHeader id="cs-heading" title="Case Studies" />
      </section>,
    )
    expect(screen.getByRole('region', { name: 'Case Studies' })).toBeInTheDocument()
  })

  it('shows the intro only when one is given', () => {
    const { rerender } = render(<SectionHeader id="h" title="About" />)
    expect(screen.queryByText('Background and links.')).not.toBeInTheDocument()

    rerender(<SectionHeader id="h" title="About" intro="Background and links." />)
    expect(screen.getByText('Background and links.')).toBeInTheDocument()
  })
})
