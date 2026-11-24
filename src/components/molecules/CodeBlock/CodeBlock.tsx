import { Fragment } from 'react'
import type { CSSProperties } from 'react'
import { useShikiHighlighter } from 'react-shiki'
import { oneDarkContrastFixes, oneLightContrastFixes } from '../../../styles/syntaxPalette'
import styles from './CodeBlock.module.css'

type CodeBlockProps = {
  code: string
  language: string
}

// Paired light/dark themes + defaultColor="light-dark()" make Shiki emit
// light-dark() CSS per token so syntax colors track the site's color-scheme.
// The contrast fixes live in the shared syntax palette, which the Skills &
// Tools category colors also derive from.
//
// Shiki highlights asynchronously, loading each language's grammar on first
// use, and gives back nothing until it's done, or ever, if a grammar fails
// to load. So the code is drawn plain first, in the same markup and theme
// colours, and the highlighted version replaces it when it arrives: the
// panel is never empty, and never changes size.
function CodeBlock({ code, language }: CodeBlockProps) {
  const highlighted = useShikiHighlighter(code, language, { light: 'one-light', dark: 'one-dark-pro' }, {
    defaultColor: 'light-dark()',
    colorReplacements: {
      'one-light': oneLightContrastFixes,
      'one-dark-pro': oneDarkContrastFixes,
    },
    engine: 'javascript',
    showLineNumbers: true,
  })
  const lines = code.split('\n')

  return (
    <div className={styles.codeBlock} style={{ '--code-lines': lines.length } as CSSProperties}>
      {highlighted ?? (
        // Focusable, like Shiki's own <pre>, so a keyboard can scroll it.
        <pre className={`shiki ${styles.plain}`} tabIndex={0} data-testid="code-plain">
          <code className="rs-has-line-numbers">
            {lines.map((line, index) => (
              <Fragment key={index}>
                <span className="line rs-line-number">{line}</span>
                {index < lines.length - 1 && '\n'}
              </Fragment>
            ))}
          </code>
        </pre>
      )}
    </div>
  )
}

export default CodeBlock
