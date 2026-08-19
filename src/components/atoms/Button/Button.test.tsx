import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Button from './Button'

describe('Button', () => {
  it('renders a link with the given label and href', () => {
    render(<Button href="/resume.pdf">Resume</Button>)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/resume.pdf')
  })

  it('has no target/rel by default', () => {
    render(<Button href="/resume.pdf">Resume</Button>)
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link).not.toHaveAttribute('target')
    expect(link).not.toHaveAttribute('rel')
  })

  it('opens externally when external is set', () => {
    render(
      <Button href="https://example.com/resume.pdf" external>
        Resume
      </Button>,
    )
    const link = screen.getByRole('link', { name: 'Resume' })
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })
})
