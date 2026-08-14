import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import MediaText from './MediaText'

describe('MediaText', () => {
  it('renders the image and the text content together', () => {
    render(
      <MediaText imageSrc="/photo.jpg" imageAlt="A description">
        <h2>Heading</h2>
        <p>Body copy</p>
      </MediaText>,
    )

    const img = screen.getByRole('img', { name: 'A description' })
    expect(img).toHaveAttribute('src', '/photo.jpg')
    expect(screen.getByRole('heading', { name: 'Heading' })).toBeInTheDocument()
    expect(screen.getByText('Body copy')).toBeInTheDocument()
  })
})
