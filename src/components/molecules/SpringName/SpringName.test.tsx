import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SpringName from './SpringName'

describe('SpringName', () => {
  it('renders an h1 whose accessible name is the whole name', () => {
    render(<SpringName id="hero-name" name="James Usher" />)
    const heading = screen.getByRole('heading', { level: 1, name: 'James Usher' })
    expect(heading).toHaveAttribute('id', 'hero-name')
    expect(heading).toHaveTextContent('James Usher')
  })

  it('splits the name into one span per letter, numbered in order', () => {
    const { container } = render(<SpringName id="h" name="Ab Cd" />)
    const letters = [...container.querySelectorAll('[style*="--i"]')]
    expect(letters.map((l) => l.textContent)).toEqual(['A', 'b', 'C', 'd'])
    expect(letters.map((l) => (l as HTMLElement).style.getPropertyValue('--i'))).toEqual(['0', '1', '2', '3'])
  })

  it('hides the letter spans from assistive tech', () => {
    const { container } = render(<SpringName id="h" name="James Usher" />)
    container.querySelectorAll('h1 > span > span').forEach((word) => {
      expect(word).toHaveAttribute('aria-hidden', 'true')
    })
  })
})
