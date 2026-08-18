import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import BentoTile from './BentoTile'

describe('BentoTile', () => {
  it('renders with the grid class matching its size', () => {
    render(
      <BentoTile
        size="2x2"
        thumbnail={{ gradientClassName: 'bento-gradient-0' }}
        typeLabel="Design"
        title="Test tile"
        summary="A short summary."
        onClick={() => {}}
      />,
    )

    expect(screen.getByRole('button', { name: /Test tile/ })).toHaveClass('bento-tile--2x2')
  })

  it('renders the title, summary, and type label', () => {
    render(
      <BentoTile
        size="1x1"
        thumbnail={{ gradientClassName: 'bento-gradient-1' }}
        typeLabel="Design"
        title="Test tile"
        summary="A short summary."
        onClick={() => {}}
      />,
    )

    expect(screen.getByRole('heading', { name: 'Test tile' })).toBeInTheDocument()
    expect(screen.getByText('A short summary.')).toBeInTheDocument()
    expect(screen.getByText('Design')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <BentoTile
        size="1x1"
        thumbnail={{ gradientClassName: 'bento-gradient-1' }}
        typeLabel="Design"
        title="Test tile"
        summary="A short summary."
        onClick={handleClick}
      />,
    )

    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('renders an image instead of the gradient placeholder once a thumbnail image is provided', () => {
    const { container } = render(
      <BentoTile
        size="1x1"
        thumbnail={{ image: '/foo.jpg', gradientClassName: 'bento-gradient-1' }}
        typeLabel="Design"
        title="Test tile"
        summary="A short summary."
        onClick={() => {}}
      />,
    )

    // The image is decorative (alt="") since the tile's title already
    // conveys the same info within the same clickable element, so it has
    // no accessible "img" role — query it directly instead.
    expect(container.querySelector('img')).toHaveAttribute('src', '/foo.jpg')
  })
})
