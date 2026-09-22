import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import ReadMoreText from './ReadMoreText'

let capturedCallback: (() => void) | null = null

class ResizeObserverStub implements ResizeObserver {
  constructor(callback: () => void) {
    capturedCallback = callback
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

function setOverflowing(el: Element, isOverflowing: boolean) {
  Object.defineProperty(el, 'scrollHeight', { configurable: true, value: isOverflowing ? 400 : 100 })
  Object.defineProperty(el, 'clientHeight', { configurable: true, value: 100 })
}

describe('ReadMoreText', () => {
  beforeEach(() => {
    capturedCallback = null
    window.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver
  })

  it('renders its children with no toggle when the content is not overflowing', () => {
    render(
      <ReadMoreText>
        <p>Short text</p>
      </ReadMoreText>,
    )

    expect(screen.getByText('Short text')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('shows a Read more toggle once the content is detected as overflowing', () => {
    render(
      <ReadMoreText>
        <p>Long text</p>
      </ReadMoreText>,
    )

    setOverflowing(screen.getByText('Long text').parentElement!, true)
    act(() => capturedCallback?.())

    expect(screen.getByRole('button', { name: 'Read more' })).toBeInTheDocument()
  })

  it('expands the content and flips the toggle to Read less on click', async () => {
    const user = userEvent.setup()
    render(
      <ReadMoreText>
        <p>Long text</p>
      </ReadMoreText>,
    )

    setOverflowing(screen.getByText('Long text').parentElement!, true)
    act(() => capturedCallback?.())

    const toggle = screen.getByRole('button', { name: 'Read more' })
    await user.click(toggle)

    expect(screen.getByRole('button', { name: 'Read less' })).toHaveAttribute('aria-expanded', 'true')
  })

  it('collapses back and re-detects overflow on a second click', async () => {
    const user = userEvent.setup()
    render(
      <ReadMoreText>
        <p>Long text</p>
      </ReadMoreText>,
    )

    setOverflowing(screen.getByText('Long text').parentElement!, true)
    act(() => capturedCallback?.())
    await user.click(screen.getByRole('button', { name: 'Read more' }))

    setOverflowing(screen.getByText('Long text').parentElement!, true)
    await user.click(screen.getByRole('button', { name: 'Read less' }))
    act(() => capturedCallback?.())

    expect(screen.getByRole('button', { name: 'Read more' })).toHaveAttribute('aria-expanded', 'false')
  })
})
