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

  it('has no active styling by default', () => {
    render(<NavLink href="#about">About</NavLink>)
    const link = screen.getByRole('link', { name: 'About' })
    expect(link).not.toHaveClass('active')
    expect(link).not.toHaveAttribute('aria-current')
  })

  it('marks itself active when isActive is set', () => {
    render(
      <NavLink href="#about" isActive>
        About
      </NavLink>,
    )
    const link = screen.getByRole('link', { name: 'About' })
    expect(link).toHaveClass('active')
    expect(link).toHaveAttribute('aria-current', 'page')
  })
})
