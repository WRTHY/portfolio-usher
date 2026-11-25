import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Unmount after every test
afterEach(() => {
  cleanup()
})

// Browser APIs jsdom doesn't implement.
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

if (!window.ResizeObserver) {
  class ResizeObserverStub implements ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }

  window.ResizeObserver = ResizeObserverStub
}
