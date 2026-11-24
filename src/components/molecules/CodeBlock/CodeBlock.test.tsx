import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CodeBlock from './CodeBlock'

const code = "name: CI\non:\n  push:\n    branches: [master]"

describe('CodeBlock', () => {
  // Shiki highlights asynchronously and draws nothing until it's done, or
  // ever, if a grammar fails to load: the code has to be there regardless.
  it('shows the code at once, a line per row, before any highlighting', () => {
    render(<CodeBlock code={code} language="yaml" />)

    const plain = screen.getByTestId('code-plain')
    expect(plain).toHaveTextContent('branches: [master]')
    expect(plain.querySelectorAll('.line')).toHaveLength(4)
  })

  it('swaps in the highlighted code when it arrives', async () => {
    render(<CodeBlock code={code} language="yaml" />)

    await screen.findByText('branches', {}, { timeout: 5000 })
    expect(screen.queryByTestId('code-plain')).not.toBeInTheDocument()
  })
})
