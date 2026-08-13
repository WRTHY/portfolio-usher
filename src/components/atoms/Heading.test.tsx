import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Heading from './Heading'

describe('Heading', () => {
  it('renders an h1 when level is 1', () => {
    render(<Heading level={1}>Your Name</Heading>)
    expect(screen.getByRole('heading', { level: 1, name: 'Your Name' })).toBeInTheDocument()
  })

  it('defaults to an h2 when no level is given', () => {
    render(<Heading>About</Heading>)
    expect(screen.getByRole('heading', { level: 2, name: 'About' })).toBeInTheDocument()
  })
})
