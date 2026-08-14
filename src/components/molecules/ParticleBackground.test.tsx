import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import ParticleBackground from './ParticleBackground'

describe('ParticleBackground', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders nothing when the user prefers reduced motion', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: true,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }))

    const { container } = render(<ParticleBackground />)

    expect(container).toBeEmptyDOMElement()
  })
})
