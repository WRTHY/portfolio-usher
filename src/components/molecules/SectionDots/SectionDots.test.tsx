import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SectionDots from './SectionDots'
import { sections } from '../../../content/navigation'

describe('SectionDots', () => {
  it('renders a dot for every section', () => {
    render(<SectionDots />)
    sections.forEach((section) => {
      expect(screen.getByRole('link', { name: section.label })).toBeInTheDocument()
    })
  })

  it('counts the hero as the first dot, active until a section is reached', () => {
    render(<SectionDots />)
    const dots = screen.getAllByRole('link')
    expect(dots).toHaveLength(sections.length + 1)
    expect(dots[0]).toHaveAttribute('href', '#top')
    expect(dots[0]).toHaveAttribute('aria-current', 'true')
    sections.forEach((section) => {
      expect(screen.getByRole('link', { name: section.label })).not.toHaveAttribute('aria-current')
    })
  })
})
