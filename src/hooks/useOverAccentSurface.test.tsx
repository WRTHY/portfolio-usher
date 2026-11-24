import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useOverAccentSurface from './useOverAccentSurface'

function Probe() {
  const ref = useRef<HTMLDivElement>(null)
  const over = useOverAccentSurface(ref)
  return (
    <div ref={ref} data-testid="probe">
      {over ? 'over' : 'clear'}
    </div>
  )
}

// jsdom has no layout, so each box is stubbed: the probe is a small fixed
// element, the accent section a band whose position the tests move.
const box = (top: number, height: number, left = 0, width = 1000) =>
  ({ top, bottom: top + height, left, right: left + width, width, height, x: left, y: top }) as DOMRect

describe('useOverAccentSurface', () => {
  let sectionTop = 1000

  beforeEach(() => {
    vi.useFakeTimers()
    const section = document.createElement('section')
    section.dataset.surface = 'accent'
    section.getBoundingClientRect = () => box(sectionTop, 800)
    document.body.append(section)
  })

  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
    sectionTop = 1000
  })

  const renderProbe = () => {
    render(<Probe />)
    screen.getByTestId('probe').getBoundingClientRect = () => box(100, 20, 24, 8)
  }
  const nextFrame = () => act(() => vi.advanceTimersToNextFrame())

  it('is clear while no accent section is behind it', () => {
    renderProbe()
    nextFrame()
    expect(screen.getByTestId('probe')).toHaveTextContent('clear')
  })

  it('turns on once a scroll brings an accent section behind it, and off once it passes', () => {
    renderProbe()
    nextFrame()

    sectionTop = 50
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    nextFrame()
    expect(screen.getByTestId('probe')).toHaveTextContent('over')

    sectionTop = -900
    act(() => {
      window.dispatchEvent(new Event('scroll'))
    })
    nextFrame()
    expect(screen.getByTestId('probe')).toHaveTextContent('clear')
  })

  it('is never over anything while hidden (no box)', () => {
    sectionTop = 0
    renderProbe()
    screen.getByTestId('probe').getBoundingClientRect = () => box(0, 0, 0, 0)
    nextFrame()
    expect(screen.getByTestId('probe')).toHaveTextContent('clear')
  })
})
