import { describe, expect, it } from 'vitest'
import { skillHues, skillPillVars } from './syntaxPalette'
import type { SkillColorway } from './syntaxPalette'

// Card backgrounds the pills sit on, from index.css: --bg (Experience cards)
// and --section-alt-bg (Case Studies cards). Update these if those change.
const cardBackgrounds = {
  light: ['#f8f1e1', '#f1e6cc'],
  dark: ['#16171d', '#1c1e26'],
} as const

type Rgb = [number, number, number]

function parseHex(hex: string): Rgb {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as Rgb
}

function parseRgba(value: string): { rgb: Rgb; alpha: number } {
  const [r, g, b, alpha] = value.match(/[\d.]+/g)!.map(Number)
  return { rgb: [r, g, b], alpha }
}

// WCAG 2 relative luminance and contrast ratio.
function luminance([r, g, b]: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

// A translucent tint over an opaque background, as the browser paints it.
function composite(fg: Rgb, alpha: number, bg: Rgb): Rgb {
  return fg.map((c, i) => c * alpha + bg[i] * (1 - alpha)) as Rgb
}

// Splits "light-dark(a, b)" into its two values (b may contain commas).
function splitLightDark(value: string): { light: string; dark: string } {
  const inner = value.slice('light-dark('.length, -1)
  const match = inner.match(/^(rgba\([^)]*\)|#[0-9a-f]{6}), (.*)$/i)!
  return { light: match[1], dark: match[2] }
}

describe('skillPillVars', () => {
  it('emits light-dark() text and background vars', () => {
    const vars = skillPillVars('testing') as Record<string, string>
    expect(vars['--skill-text']).toMatch(/^light-dark\(#[0-9a-f]{6}, #[0-9a-f]{6}\)$/i)
    expect(vars['--skill-bg']).toMatch(/^light-dark\(rgba\(.+\), rgba\(.+\)\)$/)
  })

  it('uses the code colors as-is in dark mode', () => {
    const vars = skillPillVars('testing') as Record<string, string>
    expect(splitLightDark(vars['--skill-text']).dark).toBe(skillHues.testing.dark)
  })

  // Light-mode text is derived from the code color, not hand-picked: a
  // uniform scale toward black keeps each channel's ratio, so the hue holds.
  it.each(Object.keys(skillHues) as SkillColorway[])(
    'derives %s light-mode text as a darker shade of its code color',
    (colorway) => {
      const vars = skillPillVars(colorway) as Record<string, string>
      const derived = parseHex(splitLightDark(vars['--skill-text']).light)
      const code = parseHex(skillHues[colorway].light)

      expect(luminance(derived)).toBeLessThan(luminance(code))
      derived.forEach((channel, i) => {
        expect(channel).toBeCloseTo(code[i] * 0.92, -0.5)
      })
    },
  )

  // The pill text reuses the code block's colors, which were tuned against
  // --code-bg rather than a tinted pill - this keeps them readable (WCAG AA,
  // 4.5:1 for small text) wherever pills actually render.
  it.each(Object.keys(skillHues) as SkillColorway[])(
    'keeps %s pill text at 4.5:1 or better on every card background',
    (colorway) => {
      const vars = skillPillVars(colorway) as Record<string, string>
      const text = splitLightDark(vars['--skill-text'])
      const bg = splitLightDark(vars['--skill-bg'])

      for (const mode of ['light', 'dark'] as const) {
        const tint = parseRgba(bg[mode])
        for (const card of cardBackgrounds[mode]) {
          const pill = composite(tint.rgb, tint.alpha, parseHex(card))
          expect(contrast(parseHex(text[mode]), pill)).toBeGreaterThanOrEqual(4.5)
        }
      }
    },
  )
})
