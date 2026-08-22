import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Hero from './Hero'

// @tsparticles/react is stubbed globally in src/test/setup.ts — Hero's own
// tests don't assert anything about the particle effect.

describe('Hero', () => {
  it('renders the given name and tagline', () => {
    render(<Hero name="Test Name" tagline="Test tagline" resumeUrl="/resume.pdf" />)
    expect(screen.getByRole('heading', { level: 1, name: 'Test Name' })).toBeInTheDocument()
    expect(screen.getByText('Test tagline')).toBeInTheDocument()
  })

  it('links the resume button to the given resumeUrl', () => {
    render(<Hero name="Test Name" tagline="Test tagline" resumeUrl="/resume.pdf" />)
    expect(screen.getByRole('link', { name: 'My Resume' })).toHaveAttribute('href', '/resume.pdf')
  })
})
