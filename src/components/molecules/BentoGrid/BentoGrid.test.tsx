import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BentoGrid from './BentoGrid'
import type { CaseStudy, TileSize } from '../../../content/caseStudies'

function makeCaseStudy(overrides: Partial<CaseStudy> & { id: string; title: string }): CaseStudy {
  return {
    summary: 'Summary',
    tags: ['Tag'],
    problem: 'Problem',
    approach: 'Approach',
    outcome: 'Outcome',
    ...overrides,
  }
}

describe('BentoGrid', () => {
  it('renders a tile for every item, defaulting an omitted size to 1x1', () => {
    const items = [
      makeCaseStudy({ id: 'a', title: 'Tile Alpha', size: '2x2' }),
      makeCaseStudy({ id: 'b', title: 'Tile Bravo' }),
      makeCaseStudy({ id: 'c', title: 'Tile Charlie', size: '1x2' }),
    ]
    render(<BentoGrid items={items} onSelect={() => {}} />)

    expect(screen.getByRole('button', { name: /Tile Alpha/ })).toHaveClass('bento-tile--2x2')
    expect(screen.getByRole('button', { name: /Tile Bravo/ })).toHaveClass('bento-tile--1x1')
    expect(screen.getByRole('button', { name: /Tile Charlie/ })).toHaveClass('bento-tile--1x2')
  })

  it('handles an arbitrary mix of sizes and counts without special-casing any position', () => {
    const sizes: readonly TileSize[] = ['1x1', '1x2', '2x1', '2x2', '1x1', '2x1', '1x2']
    const items = sizes.map((size, index) =>
      makeCaseStudy({ id: `cs-${index}`, title: `Study number ${index}`, size }),
    )
    render(<BentoGrid items={items} onSelect={() => {}} />)

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(items.length)
    buttons.forEach((button, index) => {
      expect(button).toHaveClass(`bento-tile--${sizes[index]}`)
    })
  })

  it('calls onSelect with the clicked item id', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    const items = [makeCaseStudy({ id: 'only', title: 'Only tile' })]
    render(<BentoGrid items={items} onSelect={handleSelect} />)

    await user.click(screen.getByRole('button', { name: /Only tile/ }))

    expect(handleSelect).toHaveBeenCalledWith('only')
  })
})
