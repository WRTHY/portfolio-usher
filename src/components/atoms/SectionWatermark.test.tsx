import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SectionWatermark from './SectionWatermark'

describe('SectionWatermark', () => {
  it('renders the given text but hides it from assistive tech', () => {
    render(<SectionWatermark text="About" />)
    const el = screen.getByText('About')
    expect(el).toHaveAttribute('aria-hidden', 'true')
  })
})
