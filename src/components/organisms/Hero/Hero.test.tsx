import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the given name and tagline', () => {
    render(<Hero name="Test Name" tagline="Test tagline" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Test Name' })).toBeInTheDocument()
    expect(screen.getByText('Test tagline')).toBeInTheDocument()
  })
})
