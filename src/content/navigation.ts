// `tone` mirrors which background each section paints in its own CSS module
// (see e.g. Experience.module.css / CaseStudies.module.css), kept here too
// so InfoPanel can match its background without reaching into other modules.
export const sections = [
  { id: 'about', label: 'About', description: 'Background and links.', tone: 'base' },
  {
    id: 'experience',
    label: 'Experience',
    description: 'A card per role, with stack and impact.',
    tone: 'alt',
  },
  {
    id: 'case-studies',
    label: 'Case Studies',
    description: 'A card grid of expandable write-ups (problem → approach → outcome).',
    tone: 'base',
  },
  {
    id: 'code-samples',
    label: 'Automation Examples',
    description: 'Syntax-highlighted Playwright/Cypress snippets.',
    tone: 'alt',
  },
  {
    id: 'api-testing',
    label: 'API Testing',
    description: 'Static REST API test examples against reqres.in.',
    tone: 'base',
  },
] as const

export function getSectionLabel(id: (typeof sections)[number]['id']): string {
  return sections.find((section) => section.id === id)!.label
}

export type SectionTone = (typeof sections)[number]['tone']

export function getSectionTone(id: (typeof sections)[number]['id']): SectionTone {
  return sections.find((section) => section.id === id)!.tone
}

// The page's alternating-surface rule: anything sitting on a section (its
// cards, InfoPanel, MobileInfoCard) takes the opposite background, so it
// reads as a distinct surface on either tone.
export function contrastSurface(tone: SectionTone): string {
  return tone === 'alt' ? 'var(--bg)' : 'var(--section-alt-bg)'
}
