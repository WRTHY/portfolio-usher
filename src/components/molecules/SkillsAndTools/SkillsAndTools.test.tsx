import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import SkillsAndTools from './SkillsAndTools'
import { toolCategories } from './toolCategories'

const allTools = toolCategories.flatMap((category) => category.tools)

describe('SkillsAndTools', () => {
  it('names every tool beside its icon', () => {
    render(<SkillsAndTools />)
    allTools.forEach((tool) => {
      expect(screen.getByText(tool.name)).toBeVisible()
    })
  })

  it('makes only the tools a role used into filter buttons', async () => {
    const user = userEvent.setup()
    const onPick = vi.fn()
    render(<SkillsAndTools usedTools={new Set(['Cypress'])} picked="Cypress" onPick={onPick} />)

    const cypress = screen.getByRole('button', { name: 'Cypress' })
    expect(cypress).toHaveAttribute('aria-pressed', 'true')
    expect(screen.queryByRole('button', { name: 'Vitest' })).not.toBeInTheDocument()

    // Picking the picked tool again clears it.
    await user.click(cypress)
    expect(onPick).toHaveBeenCalledWith(null)
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
