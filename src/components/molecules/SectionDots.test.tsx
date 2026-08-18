import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SectionDots from './SectionDots'
import { sections } from '../../content/navigation'
import styles from './SectionDots.module.css'

describe('SectionDots', () => {
  it('renders a dot for every section', () => {
    render(<SectionDots />)
    sections.forEach((section) => {
      expect(screen.getByRole('link', { name: section.label })).toBeInTheDocument()
    })
  })

  it('marks the first section active by default', () => {
    render(<SectionDots />)
    expect(screen.getByRole('link', { name: sections[0].label })).toHaveClass(styles.active)
  })
})
