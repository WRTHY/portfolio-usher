import type { CSSProperties } from 'react'

// The single source of truth for the syntax-highlighting hues that the
// Skills & Tools categories borrow (see DESIGN.md's accent exception).
// CodeBlock's Shiki contrast fixes and the skill chips/pills both read from
// here, so retuning a code color retunes its skill category with it.

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

// Only one-dark-pro's coral token (4.38:1) falls short.
export const oneDarkContrastFixes = {
  [oneDark.coral]: '#e37179',
} as const

export type SkillColorway = 'languages' | 'testing' | 'tools' | 'devops'

type SkillHue = {
  // The contrast-fixed text color this hue renders as in each code theme.
  light: string
  dark: string
  // one-dark-pro's base hue, used for the translucent tints behind it.
  tint: string
  // Skills & Tools chip background opacity.
  chipAlpha: number
}

// Category → code hue: blue = types/functions, coral = keywords/tags,
// green = strings, yellow = constants/parameters.
export const skillHues: Record<SkillColorway, SkillHue> = {
  languages: {
    light: oneLightContrastFixes['#4078f2'],
    dark: oneDark.blue,
    tint: oneDark.blue,
    chipAlpha: 0.3,
  },
  testing: {
    light: oneLightContrastFixes['#e45649'],
    dark: oneDarkContrastFixes[oneDark.coral],
    tint: oneDark.coral,
    chipAlpha: 0.3,
  },
  tools: {
    light: oneLightContrastFixes['#50a14f'],
    dark: oneDark.green,
    tint: oneDark.green,
    chipAlpha: 0.32,
  },
  devops: {
    light: oneLightContrastFixes['#c18401'],
    dark: oneDark.yellow,
    tint: oneDark.yellow,
    chipAlpha: 0.32,
  },
}

// Pill tint opacity per color scheme. Light matches the violet accent
// Badge's 0.1 (--accent-bg) so every pill reads with the same weight.
const PILL_ALPHA = { light: 0.1, dark: 0.12 } as const

// The code colors were tuned against plain --code-bg, not a tinted pill.
// At the light tint above they'd dip just under 4.5:1 on the darker
// --section-alt-bg cards, so light-mode pill text is the code color scaled
// 8% toward black - same hue, derived rather than hand-picked, so it still
// follows the code palette. Lowest result is testing at ~4.93:1. Dark mode
// clears 4.5:1 with the code colors as-is.
const LIGHT_TEXT_DARKEN = 0.08

function parseHex(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number]
}

function rgba(hex: string, alpha: number): string {
  const [r, g, b] = parseHex(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function darken(hex: string, amount: number): string {
  const channels = parseHex(hex).map((c) =>
    Math.round(c * (1 - amount))
      .toString(16)
      .padStart(2, '0'),
  )
  return `#${channels.join('')}`
}

// CSS custom properties for a skill Badge pill: hue-colored text on a faint
// tint of that hue, tracking the site's color-scheme via light-dark().
export function skillPillVars(colorway: SkillColorway): CSSProperties {
  const { light, dark, tint } = skillHues[colorway]
  return {
    '--skill-text': `light-dark(${darken(light, LIGHT_TEXT_DARKEN)}, ${dark})`,
    '--skill-bg': `light-dark(${rgba(tint, PILL_ALPHA.light)}, ${rgba(tint, PILL_ALPHA.dark)})`,
  } as CSSProperties
}

// CSS custom property for a Skills & Tools chip's background tint.
export function skillChipVars(colorway: SkillColorway): CSSProperties {
  const { tint, chipAlpha } = skillHues[colorway]
  return { '--skill-bg': rgba(tint, chipAlpha) } as CSSProperties
}
