import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SkillsAndTools from './SkillsAndTools'
import { toolCategories } from './toolCategories'

const allTools = toolCategories.flatMap((category) => category.tools)

describe('SkillsAndTools', () => {
  it('names every tool, whether or not its preview is showing', () => {
    render(<SkillsAndTools />)

    // Each name is there twice: the hover preview and the screen-reader text.
    allTools.forEach((tool) => {
      expect(screen.getAllByText(tool.name).length).toBeGreaterThan(0)
    })
  })

  it('hides every icon from the accessibility tree', () => {
    const { container } = render(<SkillsAndTools />)

    // The wrapper around each icon, not the icon itself, carries aria-hidden.
    const iconWraps = container.querySelectorAll('[class*="icon"]')
    expect(iconWraps.length).toBe(allTools.length)
    iconWraps.forEach((iconWrap) => {
      expect(iconWrap.getAttribute('aria-hidden')).toBe('true')
      expect(iconWrap.children.length).toBeGreaterThan(0)
    })
  })

  it('groups each category behind a named list for screen reader context', () => {
    render(<SkillsAndTools />)

    toolCategories.forEach((category) => {
      const list = screen.getByRole('list', { name: category.ariaLabel })
      category.tools.forEach((tool) => {
        expect(list).toHaveTextContent(tool.name)
      })
    })
  })
})
