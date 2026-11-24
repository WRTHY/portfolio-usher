import type { CSSProperties } from 'react'
import styles from './CodeBlock.module.css'

type CodeBlockProps = {
  /** The code as plain text; its line count sizes the block. */
  code: string
  /** The same code, highlighted at build time (see scripts/highlight.ts). */
  html: string
}

// The markup comes from our own repo's files, made at build time, and is
// never user input, so it's safe to inject. Highlighting before the page
// ships means the panel is complete on first paint: nothing to wait for,
// nothing that can fail to load, and nothing that changes size.
function CodeBlock({ code, html }: CodeBlockProps) {
  const lines = code.split('\n').length

  return (
    <div
      className={styles.codeBlock}
      style={{ '--code-lines': lines } as CSSProperties}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default CodeBlock
