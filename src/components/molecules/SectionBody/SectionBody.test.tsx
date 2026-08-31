import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SectionBody from './SectionBody'

describe('SectionBody', () => {
  it('renders its children', () => {
    render(
      <SectionBody>
        <p>Content</p>
      </SectionBody>,
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('applies the given gap as an inline style', () => {
    render(
      <SectionBody gap={16}>
        <p>Content</p>
      </SectionBody>,
    )
    expect(screen.getByText('Content').parentElement).toHaveStyle({ gap: '16px' })
  })
})
