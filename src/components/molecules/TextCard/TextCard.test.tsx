import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import TextCard from './TextCard'

describe('TextCard', () => {
  it('renders its children inside the card', () => {
    render(
      <TextCard>
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </TextCard>,
    )

    expect(screen.getByText('First paragraph')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph')).toBeInTheDocument()
  })
})
