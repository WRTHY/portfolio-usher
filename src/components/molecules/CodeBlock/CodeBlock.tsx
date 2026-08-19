import ShikiHighlighter from 'react-shiki'

type CodeBlockProps = {
  code: string
  language: string
}

// Paired light/dark themes plus defaultColor="light-dark()" make Shiki emit
// CSS light-dark() values per token instead of one hardcoded color — so
// syntax colors track the site's own color-scheme (driven by ThemeToggle's
// data-mode attribute) the same way every custom property in index.css
// does. A single dark-only theme here previously failed color-contrast
// against the light-mode code background.
//
// one-light's own de-emphasis colors (comments/punctuation, e.g. #A0A1A7)
// are still too light to hit 4.5:1 against any workable light background —
// syntax themes are designed for aesthetics, not WCAG, and this is common
// across most bundled light themes, not a one-light-specific issue (checked
// several). Rather than invent a bespoke palette, this darkens just the
// handful of one-light tokens that actually fail against --code-bg,
// keeping each color's original hue — same theme, same background, minimum
// change needed to clear AA.
// Shiki lowercases each token's color before looking it up in this map, so
// the keys have to be lowercase too or the replacement silently no-ops.
const LIGHT_THEME_CONTRAST_FIXES: Record<string, string> = {
  '#e45649': '#bf2a1c',
  '#50a14f': '#387137',
  '#4078f2': '#1056ef',
  '#986801': '#845a01',
  '#0184bc': '#016b98',
  '#a0a1a7': '#62646a',
  '#c18401': '#845a01',
}

function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <ShikiHighlighter
      language={language}
      theme={{ light: 'one-light', dark: 'one-dark-pro' }}
      defaultColor="light-dark()"
      colorReplacements={{ 'one-light': LIGHT_THEME_CONTRAST_FIXES }}
      engine="javascript"
      showLineNumbers
      showLanguage={false}
      addDefaultStyles={false}
      className="code-block"
    >
      {code}
    </ShikiHighlighter>
  )
}

export default CodeBlock
