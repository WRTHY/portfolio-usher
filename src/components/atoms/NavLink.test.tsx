import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import NavLink from './NavLink'

describe('NavLink', () => {
  it('renders a link with the given label and href', () => {
    render(<NavLink href="#about">About</NavLink>)
    const link = screen.getByRole('link', { name: 'About' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '#about')
  })
})
