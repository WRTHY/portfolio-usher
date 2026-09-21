import type { CSSProperties } from 'react'
import ShikiHighlighter from 'react-shiki'
import styles from './CodeBlock.module.css'

type CodeBlockProps = {
  code: string
  language: string
}

// Paired light/dark themes + defaultColor="light-dark()" make Shiki emit
// light-dark() CSS per token so syntax colors track the site's color-scheme.
// one-light's de-emphasis colors (e.g. #A0A1A7) still fall short of 4.5:1
// against --code-bg, so these darken just the tokens that fail, same hue.
// Keys must be lowercase - Shiki lowercases before the lookup.
const LIGHT_THEME_CONTRAST_FIXES: Record<string, string> = {
  '#e45649': '#bf2a1c',
  '#50a14f': '#387137',
  '#4078f2': '#1056ef',
  '#986801': '#845a01',
  '#0184bc': '#016b98',
  '#a0a1a7': '#62646a',
  '#c18401': '#845a01',
}

// Same idea for one-dark-pro: its coral token (4.38:1) and comment gray
// (3.73:1, against the theme's own #282c34 background) fall short.
const DARK_THEME_CONTRAST_FIXES: Record<string, string> = {
  '#e06c75': '#e37179',
  '#7f848e': '#9198a3',
}

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
        'one-light': LIGHT_THEME_CONTRAST_FIXES,
        'one-dark-pro': DARK_THEME_CONTRAST_FIXES,
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
