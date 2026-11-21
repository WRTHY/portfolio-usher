import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import Hero from './Hero'
import { hero } from '../../../content/hero'
import { siteContent } from '../../../content/site'

describe('Hero', () => {
  it('leads with the name, the pitch and the two actions', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1, name: siteContent.name })).toBeInTheDocument()
    expect(screen.getByText(hero.lead.highlight)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Download resume' })).toHaveAttribute('href', siteContent.resumeUrl)
    expect(screen.getByRole('link', { name: 'Email me' })).toHaveAttribute('href', expect.stringMatching(/^mailto:/))
  })

  it('is the region named by the hero heading', () => {
    render(<Hero />)
    expect(screen.getByRole('region', { name: siteContent.name })).toHaveAttribute('id', 'top')
  })

  it('docks the test run', () => {
    render(<Hero />)
    const run = screen.getByRole('figure', { name: 'Career highlights, formatted as a test run' })
    expect(within(run).getByText(`${hero.run.results.length} passed`)).toBeInTheDocument()
  })

  it('turns the locator inspector on with the switch, starting on the name', async () => {
    const user = userEvent.setup()
    render(<Hero />)
    const toggle = screen.getByRole('switch', { name: 'Pick locator' })
    expect(toggle).not.toBeChecked()

    await user.click(toggle)

    expect(toggle).toBeChecked()
    expect(screen.getByTestId('locator-tip')).toHaveTextContent("getByRole('heading', { level: 1 })")
    expect(document.documentElement).toHaveClass('inspecting')

    await user.click(toggle)
    expect(toggle).not.toBeChecked()
    expect(screen.queryByTestId('locator-tip')).not.toBeInTheDocument()
    expect(document.documentElement).not.toHaveClass('inspecting')
  })

  it('picks whatever tagged element is hovered, and clicks pick instead of navigating', async () => {
    const user = userEvent.setup()
    render(<Hero />)
    await user.click(screen.getByRole('switch', { name: 'Pick locator' }))

    const email = screen.getByRole('link', { name: 'Email me' })
    await user.hover(email)
    expect(screen.getByTestId('locator-tip')).toHaveTextContent("getByRole('link', { name: 'Email me' })")

    const clicked = new MouseEvent('click', { bubbles: true, cancelable: true })
    act(() => {
      screen.getByRole('link', { name: 'Download resume' }).dispatchEvent(clicked)
    })
    expect(clicked.defaultPrevented).toBe(true)
    expect(screen.getByTestId('locator-tip')).toHaveTextContent('Download resume')
  })

  it('stops on Escape and returns focus to the switch', async () => {
    const user = userEvent.setup()
    render(<Hero />)
    const toggle = screen.getByRole('switch', { name: 'Pick locator' })
    await user.click(toggle)
    await user.keyboard('{Escape}')

    expect(toggle).not.toBeChecked()
    expect(toggle).toHaveFocus()
  })

  it('reports when its name scrolls up under the top bar, and back', () => {
    // Capture the observer the hero sets up on its own <h1>, then play
    // intersection reports through it.
    let report: IntersectionObserverCallback = () => {}
    let observed: Element | undefined
    const original = window.IntersectionObserver
    window.IntersectionObserver = class {
      constructor(callback: IntersectionObserverCallback) {
        report = callback
      }
      observe(target: Element) {
        observed = target
      }
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return []
      }
    } as unknown as typeof IntersectionObserver

    const onNameGoneChange = vi.fn()
    try {
      render(<Hero onNameGoneChange={onNameGoneChange} />)
      expect(observed).toBe(screen.getByRole('heading', { level: 1 }))

      const entry = (isIntersecting: boolean, bottom: number) =>
        [{ isIntersecting, boundingClientRect: { bottom } }] as unknown as IntersectionObserverEntry[]
      act(() => report(entry(false, -400), {} as IntersectionObserver))
      expect(onNameGoneChange).toHaveBeenLastCalledWith(true)

      act(() => report(entry(true, 300), {} as IntersectionObserver))
      expect(onNameGoneChange).toHaveBeenLastCalledWith(false)
    } finally {
      window.IntersectionObserver = original
    }
  })

  it('tags every element it shows with a locator and an assertion', () => {
    const { container } = render(<Hero />)
    const tagged = [...container.querySelectorAll<HTMLElement>('[data-loc]')]
    expect(tagged.length).toBeGreaterThanOrEqual(6)
    tagged.forEach((element) => {
      expect(element.dataset.loc).toMatch(/^getBy\w+\(/)
      expect(element.dataset.check).toMatch(/^to\w+\(/)
    })
  })
})
