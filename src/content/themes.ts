// Each id must match a `[data-theme="..."]` block in src/index.css, which is
// where the actual color values live. This registry only exists so a future
// theme-switcher UI has something to list — it's not consulted for styling.
export const themes = [
  { id: 'cream-violet', name: 'Cream & Violet' },
  { id: 'mono', name: 'Mono' },
] as const

export type ThemeId = (typeof themes)[number]['id']
