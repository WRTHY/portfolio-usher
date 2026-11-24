import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import useActiveSection from './useActiveSection'
import { sections } from '../content/navigation'

function TestComponent() {
  const activeId = useActiveSection()
  return <div data-testid="active">{activeId || 'none'}</div>
}

// Each section's top, in px from the viewport's top (innerHeight is 768 in
// jsdom, so the line sits at about 307).
const tops = new Map<string, number>()

const scrollTo = async (positions: Record<string, number>) => {
  Object.entries(positions).forEach(([id, top]) => tops.set(id, top))
  await act(async () => {
    window.dispatchEvent(new Event('scroll'))
    await new Promise((resolve) => requestAnimationFrame(resolve))
  })
}

describe('useActiveSection', () => {
  beforeEach(() => {
    sections.forEach((section, index) => {
      const element = document.createElement('section')
      element.id = section.id
      tops.set(section.id, 900 + index * 1000)
      element.getBoundingClientRect = () => ({ top: tops.get(section.id)! }) as DOMRect
      document.body.appendChild(element)
    })
  })

  afterEach(() => {
    sections.forEach((section) => document.getElementById(section.id)?.remove())
    tops.clear()
  })

  it('marks nothing while the hero fills the screen, even with a section peeking in below', () => {
    tops.set(sections[0].id, 600)
    render(<TestComponent />)
    expect(screen.getByTestId('active')).toHaveTextContent('none')
  })

  it('marks a section once its top scrolls past 40% of the screen', async () => {
    render(<TestComponent />)

    await scrollTo({ [sections[0].id]: 300 })
    expect(screen.getByTestId('active')).toHaveTextContent(sections[0].id)
  })

  it('marks the last section reached, and goes back to none above the first', async () => {
    render(<TestComponent />)

    await scrollTo({ [sections[0].id]: -1200, [sections[1].id]: 100 })
    expect(screen.getByTestId('active')).toHaveTextContent(sections[1].id)

    await scrollTo({ [sections[0].id]: 700, [sections[1].id]: 1700 })
    expect(screen.getByTestId('active')).toHaveTextContent('none')
  })
})
