import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CareerGraph from './CareerGraph'
import type { CareerGraphNode } from './CareerGraph'

const nodes: CareerGraphNode[] = [
  { id: 'lead', y: 20, active: true },
  { id: 'sdet', y: 120, active: false },
  { id: 'specialist', y: 220, active: false },
  { id: 'sqe', y: 320, active: false },
]

describe('CareerGraph', () => {
  it('draws one node per role, at its y position', () => {
    const { container } = render(<CareerGraph nodes={nodes} height={340} />)
    const circles = [...container.querySelectorAll('circle')]
    expect(circles.map((c) => c.getAttribute('data-node'))).toEqual(['lead', 'sdet', 'specialist', 'sqe'])
    expect(circles.map((c) => c.getAttribute('cy'))).toEqual(['20', '120', '220', '320'])
  })

  it('joins the nodes with one straight line, first to last', () => {
    const { container } = render(<CareerGraph nodes={nodes} height={340} />)
    const lines = container.querySelectorAll('line')
    expect(lines).toHaveLength(1)
    expect(lines[0]).toHaveAttribute('y1', '20')
    expect(lines[0]).toHaveAttribute('y2', '320')
    expect(container.querySelector('path')).not.toBeInTheDocument()
  })

  it('marks active nodes', () => {
    const { container } = render(<CareerGraph nodes={nodes} height={340} />)
    const active = [...container.querySelectorAll('[data-active]')].map((c) => c.getAttribute('data-node'))
    expect(active).toEqual(['lead'])
  })

  it('marks the node whose row is highlighted', () => {
    const highlighted = nodes.map((node) => ({ ...node, highlighted: node.id === 'specialist' }))
    const { container } = render(<CareerGraph nodes={highlighted} height={340} />)
    const marked = [...container.querySelectorAll('[data-highlighted]')].map((c) => c.getAttribute('data-node'))
    expect(marked).toEqual(['specialist'])
  })

  it('is decorative, and draws nothing before positions are known', () => {
    const { container, rerender } = render(<CareerGraph nodes={nodes} height={340} />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')

    rerender(<CareerGraph nodes={[]} height={0} />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })
})
