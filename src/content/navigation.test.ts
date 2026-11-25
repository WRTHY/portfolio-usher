import { describe, expect, it } from 'vitest'
import { getSectionLabel, sections } from './navigation'

describe('sections', () => {
  it('gives every section a unique id', () => {
    const ids = sections.map((section) => section.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('getSectionLabel', () => {
  it('returns the label each section is declared with', () => {
    sections.forEach((section) => {
      expect(getSectionLabel(section.id)).toBe(section.label)
    })
  })
})
