import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import CodeBlock from './CodeBlock'

const code = 'name: CI\non:\n  push:\n    branches: [master]'
const html =
  '<pre class="shiki"><code class="has-line-numbers">' +
  code
    .split('\n')
    .map((line) => `<span class="line numbered-line">${line}</span>`)
    .join('\n') +
  '</code></pre>'

describe('CodeBlock', () => {
  it('draws the pre-highlighted code at once, a line per row', () => {
    const { container } = render(<CodeBlock code={code} html={html} />)

    expect(container).toHaveTextContent('branches: [master]')
    expect(container.querySelectorAll('.numbered-line')).toHaveLength(4)
  })

  it('reserves a row of height per line of code', () => {
    const { container } = render(<CodeBlock code={code} html={html} />)

    expect(container.firstElementChild).toHaveStyle({ '--code-lines': '4' })
  })
})
