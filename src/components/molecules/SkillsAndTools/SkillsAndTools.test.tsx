import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import SkillsAndTools from './SkillsAndTools'
import { toolCategories } from './toolCategories'

const allTools = toolCategories.flatMap((category) => category.tools)

describe('SkillsAndTools', () => {
  it('renders every tool name in the DOM, even though visually hidden pre-hover', () => {
    render(<SkillsAndTools />)

    // Each name appears twice per chip (the aria-hidden .hoverLabel and the
    // always-present .srOnly text) — asserting at least one match is enough
    // to confirm the name reaches the DOM regardless of hover state.
    allTools.forEach((tool) => {
      expect(screen.getAllByText(tool.name).length).toBeGreaterThan(0)
    })
  })

  it('hides every icon from the accessibility tree', () => {
    const { container } = render(<SkillsAndTools />)

    // Icons render as either <svg> (react-icons, the hand-drawn Reassure
    // glyph) or <span> (the Iconify mask-mode icons in BrandIcons.tsx) — the
    // wrapper itself, not the tag, is what carries aria-hidden.
    const iconWraps = container.querySelectorAll('[class*="iconWrap"]')
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
