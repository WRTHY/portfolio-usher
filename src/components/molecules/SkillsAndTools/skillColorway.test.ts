import { describe, expect, it } from 'vitest'
import { experience } from '../../../content/experience'
import { skillColorway, sortBySkillOrder } from './skillColorway'

describe('skillColorway', () => {
  it.each([
    ['Playwright', 'testing'],
    ['React', 'languages'],
    ['Jira', 'tools'],
    ['GitHub', 'devops'],
  ] as const)('matches %s to its Skills & Tools category', (label, expected) => {
    expect(skillColorway(label)).toBe(expected)
  })

  it('ignores case and surrounding whitespace', () => {
    expect(skillColorway('  playwright ')).toBe('testing')
  })

  it.each([
    ['TypeScript/JavaScript', 'languages'],
    ['Selenium/Cucumber', 'testing'],
    ['JavaScript (Node.js, React Native)', 'languages'],
  ] as const)('uses the first tool in compound label %s', (label, expected) => {
    expect(skillColorway(label)).toBe(expected)
  })

  it('resolves aliases for tools not in the Skills grid', () => {
    expect(skillColorway('React Native Testing Library')).toBe('testing')
    expect(skillColorway('LaunchDarkly')).toBe('devops')
  })

  it('returns undefined for non-tool tags', () => {
    expect(skillColorway('Leadership')).toBeUndefined()
  })

  // Guards against adding a new tool to a stack and forgetting to
  // categorize it - it would silently render as a violet pill instead.
  // Practice skills are meant to be violet, so they're listed here as
  // deliberate exceptions; add new ones to this list.
  it('categorizes every Experience stack entry that is a tool', () => {
    const practiceSkills = new Set([
      'Manual Testing',
      'QA Lifecycle',
      'Test Suite Management',
      'Documentation',
    ])
    const uncategorized = experience
      .flatMap((entry) => entry.stack ?? [])
      .filter((label) => !practiceSkills.has(label) && skillColorway(label) === undefined)
    expect(uncategorized).toEqual([])
  })
})

describe('sortBySkillOrder', () => {
  it('orders by category, then by position within the Skills grid', () => {
    expect(sortBySkillOrder(['GitHub', 'Jira', 'React', 'Cypress', 'Playwright'])).toEqual([
      'Playwright',
      'Cypress',
      'React',
      'Jira',
      'GitHub',
    ])
  })

  it('slots aliases where their grid tool sits', () => {
    expect(sortBySkillOrder(['Postman/Apidog', 'React Native Testing Library', 'Jest'])).toEqual([
      'Jest',
      'React Native Testing Library',
      'Postman/Apidog',
    ])
  })

  it('puts tools missing from the grid at the end of their category', () => {
    expect(sortBySkillOrder(['Bugsnag', 'Vercel', 'Jira'])).toEqual(['Jira', 'Vercel', 'Bugsnag'])
  })

  it('puts non-tool tags last, keeping their original order', () => {
    expect(sortBySkillOrder(['Process', 'Automation', 'Playwright'])).toEqual([
      'Playwright',
      'Process',
      'Automation',
    ])
  })

  it('does not mutate its input', () => {
    const labels = ['Jira', 'Playwright']
    sortBySkillOrder(labels)
    expect(labels).toEqual(['Jira', 'Playwright'])
  })
})
