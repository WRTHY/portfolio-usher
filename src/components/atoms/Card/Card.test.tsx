import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Card from './Card'

describe('Card', () => {
  it('renders as a div by default', () => {
    render(<Card>content</Card>)
    expect(screen.getByText('content').tagName).toBe('DIV')
  })

  it('renders as the given element and forwards its props', () => {
    render(
      <Card as="a" href="/case-study">
        Read more
      </Card>,
    )
    const link = screen.getByRole('link', { name: 'Read more' })
    expect(link).toHaveAttribute('href', '/case-study')
  })

  it('merges a caller-provided className with its own', () => {
    render(<Card className="extra">content</Card>)
    const el = screen.getByText('content')
    expect(el).toHaveClass('extra')
  })
})
