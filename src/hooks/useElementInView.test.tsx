import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useElementInView from './useElementInView'

let fire: (isIntersecting: boolean) => void
let options: IntersectionObserverInit | undefined

function Probe() {
  const inView = useElementInView('target', '0px 0px -25% 0px')
  return <p>{inView ? 'in view' : 'out of view'}</p>
}

describe('useElementInView', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        constructor(callback: IntersectionObserverCallback, init?: IntersectionObserverInit) {
          options = init
          fire = (isIntersecting) =>
            callback([{ isIntersecting } as IntersectionObserverEntry], this as unknown as IntersectionObserver)
        }
        observe() {}
        disconnect() {}
      },
    )
    const target = document.createElement('section')
    target.id = 'target'
    document.body.append(target)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    document.getElementById('target')?.remove()
  })

  it('follows the element in and out of the trimmed viewport', () => {
    render(<Probe />)
    expect(screen.getByText('out of view')).toBeInTheDocument()
    expect(options?.rootMargin).toBe('0px 0px -25% 0px')

    act(() => fire(true))
    expect(screen.getByText('in view')).toBeInTheDocument()

    act(() => fire(false))
    expect(screen.getByText('out of view')).toBeInTheDocument()
  })
})
