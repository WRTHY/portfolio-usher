import type { ReactNode } from 'react'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

afterEach(() => {
  cleanup()
})

// jsdom's canvas has no transferControlToOffscreen, so the real engine throws
// (as an unhandled rejection, since Particles doesn't await its load call)
// the moment ParticleBackground mounts. Every section renders one now, so
// stub the engine boundary globally rather than repeating this per test file.
vi.mock('@tsparticles/react', () => ({
  ParticlesProvider: ({ children }: { children: ReactNode }) => children,
  Particles: () => null,
}))

// jsdom doesn't implement matchMedia at all. Default to "no preference matched"
// so components that check media queries don't crash in tests that aren't
// specifically exercising that behavior. Individual tests can still override
// this with vi.stubGlobal('matchMedia', ...) for a specific query result.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}

// jsdom doesn't implement IntersectionObserver either. This stub never fires
// its callback, so components relying on it just keep their initial state
// during tests that aren't specifically exercising intersection behavior.
if (!window.IntersectionObserver) {
  class IntersectionObserverStub implements IntersectionObserver {
    readonly root = null
    readonly rootMargin = ''
    readonly scrollMargin = ''
    readonly thresholds: ReadonlyArray<number> = []
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return []
    }
  }

  window.IntersectionObserver = IntersectionObserverStub
}
