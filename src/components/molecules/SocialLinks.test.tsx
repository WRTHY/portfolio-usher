import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SocialLinks from './SocialLinks'

describe('SocialLinks', () => {
  it('renders a link for each social entry', () => {
    render(<SocialLinks />)
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'GitHub' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Email' })).toBeInTheDocument()
  })
})
