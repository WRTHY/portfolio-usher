import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FramedImage from './FramedImage'
import styles from './FramedImage.module.css'

describe('FramedImage', () => {
  it('renders the image with the given src and alt text', () => {
    render(<FramedImage src="/photo.jpg" alt="A description" />)
    const img = screen.getByRole('img', { name: 'A description' })
    expect(img).toHaveAttribute('src', '/photo.jpg')
  })

  it('applies an extra class alongside the base frame class', () => {
    render(<FramedImage src="/photo.jpg" alt="A description" className="about-photo" />)
    const img = screen.getByRole('img', { name: 'A description' })
    expect(img.parentElement).toHaveClass(styles.frame, 'about-photo')
  })
})
