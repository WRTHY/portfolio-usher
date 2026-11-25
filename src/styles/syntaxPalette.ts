import type { CSSProperties } from 'react'

// The single source of truth for the syntax-highlighting hues that the
// Skills & Tools categories borrow (see DESIGN.md's accent exception).
// The skill chips are tinted with one-dark-pro's own hues, and CodeBlock's
// Shiki contrast fixes for both code themes sit beside them.

// one-dark-pro's own token colors.
const oneDark = {
  blue: '#61afef',
  coral: '#e06c75',
  green: '#98c379',
  yellow: '#e5c07b',
} as const

// Theme colors that fall short of 4.5:1 against --code-bg, mapped to a
// darker (light theme) or lighter (dark theme) shade of the same hue.
// Keys must be lowercase - Shiki lowercases before the lookup.
export const oneLightContrastFixes = {
  '#e45649': '#bf2a1c',
  '#50a14f': '#387137',
  '#4078f2': '#1056ef',
  '#986801': '#845a01',
  '#0184bc': '#016b98',
  '#a0a1a7': '#62646a',
  '#c18401': '#845a01',
} as const

// one-dark-pro's coral token (4.38:1) and its comment gray (3.73:1, against
// the theme's own #282c34 background) both fall short.
export const oneDarkContrastFixes = {
  [oneDark.coral]: '#e37179',
  '#7f848e': '#9198a3',
} as const

export type SkillColorway = 'languages' | 'testing' | 'tools' | 'devops'

type SkillHue = {
  // one-dark-pro's base hue, used for the translucent tint behind a chip.
  tint: string
  // Skills & Tools chip background opacity.
  chipAlpha: number
}

// Category → code hue: blue = types/functions, coral = keywords/tags,
// green = strings, yellow = constants/parameters.
const skillHues: Record<SkillColorway, SkillHue> = {
  languages: { tint: oneDark.blue, chipAlpha: 0.3 },
  testing: { tint: oneDark.coral, chipAlpha: 0.3 },
  tools: { tint: oneDark.green, chipAlpha: 0.32 },
  devops: { tint: oneDark.yellow, chipAlpha: 0.32 },
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16))
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

// CSS custom property for a Skills & Tools chip's background tint.
export function skillChipVars(colorway: SkillColorway): CSSProperties {
  const { tint, chipAlpha } = skillHues[colorway]
  return { '--skill-bg': rgba(tint, chipAlpha) } as CSSProperties
}
