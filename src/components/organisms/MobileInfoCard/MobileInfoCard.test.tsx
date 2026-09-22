import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MobileInfoCard from './MobileInfoCard'
import { siteContent } from '../../../content/site'

describe('MobileInfoCard', () => {
  it('shows the name and the label it was given', () => {
    render(<MobileInfoCard label="Experience" tone="base" />)

    const card = screen.getByTestId('mobile-info-card')
    expect(card).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByText(siteContent.name)).toBeInTheDocument()
    expect(screen.getByText('Experience')).toBeInTheDocument()
  })

  // role (tagline) and quickSummary both live in the hamburger menu (see
  // Nav.tsx) to keep this card to just identity + label.
  it('does not show the role or quickSummary - those live in the hamburger menu instead', () => {
    render(<MobileInfoCard label="About" tone="base" />)
    expect(screen.queryByText(siteContent.tagline)).not.toBeInTheDocument()
    expect(screen.queryByText(siteContent.quickSummary)).not.toBeInTheDocument()
  })

  it('renders whatever label it is given, without deriving it itself', () => {
    const { rerender } = render(<MobileInfoCard label="About" tone="base" />)
    expect(screen.getByText('About')).toBeInTheDocument()

    rerender(<MobileInfoCard label="Case Studies" tone="base" />)
    expect(screen.getByText('Case Studies')).toBeInTheDocument()
    expect(screen.queryByText('About')).not.toBeInTheDocument()
  })

  // Same alternating rule as the section's own cards: opposite surface to
  // whatever the hosting section paints.
  it.each([
    ['base', 'var(--section-alt-bg)'],
    ['alt', 'var(--bg)'],
  ] as const)('on a %s section, uses the %s surface', (tone, surface) => {
    render(<MobileInfoCard label="About" tone={tone} />)
    expect(screen.getByTestId('mobile-info-card').style.getPropertyValue('--card-bg')).toBe(surface)
  })
})
