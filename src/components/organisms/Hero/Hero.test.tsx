import type { ReactNode } from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Hero from './Hero'

// jsdom's canvas has no transferControlToOffscreen, so the real engine throws
// (as an unhandled rejection, since Particles doesn't await its load call)
// the moment ParticleBackground mounts. Hero's own tests don't assert
// anything about the particle effect, so stub the engine boundary instead of
// letting jsdom attempt real canvas/WebGL work it can't support.
vi.mock('@tsparticles/react', () => ({
  ParticlesProvider: ({ children }: { children: ReactNode }) => children,
  Particles: () => null,
}))

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
