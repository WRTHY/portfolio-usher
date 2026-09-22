import type { CSSProperties } from 'react'
import ShikiHighlighter from 'react-shiki'
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
function CodeBlock({ code, language }: CodeBlockProps) {
  // Reserves this file's own line height so the gap before Shiki's async
  // highlight() resolves doesn't collapse to 0, without padding shorter
  // files out to match a taller sibling.
  const lines = code.split('\n').length

  return (
    <ShikiHighlighter
      language={language}
      theme={{ light: 'one-light', dark: 'one-dark-pro' }}
      defaultColor="light-dark()"
      colorReplacements={{
        'one-light': oneLightContrastFixes,
        'one-dark-pro': oneDarkContrastFixes,
      }}
      engine="javascript"
      showLineNumbers
      showLanguage={false}
      addDefaultStyles={false}
      className={styles.codeBlock}
      style={{ '--code-lines': lines } as CSSProperties}
    >
      {code}
    </ShikiHighlighter>
  )
}

export default CodeBlock
