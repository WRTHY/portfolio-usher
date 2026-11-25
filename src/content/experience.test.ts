import { describe, expect, it } from 'vitest'
import { education, experience, remainingStack } from './experience'

// The Experience ledger is built to be scanned: one sentence and a handful
// of tools per role, with a few detail bullets behind the "+". These keep the
// content inside that shape.
describe('experience content', () => {
  it('gives every role a unique id', () => {
    const ids = experience.map((entry) => entry.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it.each(experience.map((entry) => [entry.role, entry] as const))(
    '%s has a short impact line',
    (_role, entry) => {
      expect(entry.impact.trim()).toMatch(/[.!]$/)
      expect(entry.impact.length).toBeLessThanOrEqual(180)
    },
  )

  it.each(experience.map((entry) => [entry.role, entry] as const))(
    '%s lists at most four key tools, without repeats',
    (_role, entry) => {
      expect(entry.keyTools.length).toBeLessThanOrEqual(4)
      const tools = entry.keyTools.map(({ tool }) => tool)
      expect(new Set(tools).size).toBe(tools.length)
    },
  )

  it.each(experience.map((entry) => [entry.role, entry] as const))(
    '%s lists test frameworks, each with a short note of what it tested',
    (_role, entry) => {
      entry.keyTools.forEach(({ tool, scope }) => {
        // Languages belong in the full stack, not the key tools column.
        expect(tool).not.toMatch(/^(TypeScript|JavaScript)/)
        expect(scope.trim().length).toBeGreaterThan(0)
        expect(scope.length).toBeLessThanOrEqual(24)
      })
    },
  )

  it.each(experience.map((entry) => [entry.role, entry] as const))(
    "%s's key tools are all in its full stack, so opening the role only adds to them",
    (_role, entry) => {
      if (!entry.stack) return
      entry.keyTools.forEach(({ tool, covers }) => {
        ;(covers ?? [tool]).forEach((name) => expect(entry.stack).toContain(name))
      })
      expect(remainingStack(entry).length).toBe(
        entry.stack.length - entry.keyTools.flatMap(({ tool, covers }) => covers ?? [tool]).length,
      )
    },
  )

  it('closes with the degree, under its own id', () => {
    expect(experience.map((entry) => entry.id)).not.toContain(education.id)
    expect(education.schoolUrl).toMatch(/^https:\/\//)
  })

  it.each(experience.map((entry) => [entry.role, entry] as const))(
    '%s has two to six detail bullets for its expanded view',
    (_role, entry) => {
      expect(entry.details.length).toBeGreaterThanOrEqual(2)
      expect(entry.details.length).toBeLessThanOrEqual(6)
      entry.details.forEach((detail) => expect(detail.trim()).toMatch(/[.!]$/))
    },
  )

  it('links every company', () => {
    experience.forEach((entry) => {
      expect(entry.companyUrl).toMatch(/^https:\/\//)
    })
  })
})
