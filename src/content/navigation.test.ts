import { describe, expect, it } from 'vitest'
import { contrastSurface, getSectionTone, sections } from './navigation'

describe('contrastSurface', () => {
  it('puts --section-alt-bg surfaces on base sections and --bg on alt ones', () => {
    expect(contrastSurface('base')).toBe('var(--section-alt-bg)')
    expect(contrastSurface('alt')).toBe('var(--bg)')
  })
})

describe('getSectionTone', () => {
  it('returns the tone each section is declared with', () => {
    sections.forEach((section) => {
      expect(getSectionTone(section.id)).toBe(section.tone)
    })
  })

  // Sections alternate down the page, so neighbours never share a tone.
  it('alternates tones between neighbouring sections', () => {
    sections.slice(1).forEach((section, i) => {
      expect(section.tone).not.toBe(sections[i].tone)
    })
  })
})
