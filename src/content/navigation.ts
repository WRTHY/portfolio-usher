// `tone` mirrors which background each section actually paints in its own
// CSS module (see e.g. Experience.module.css / CaseStudies.module.css) —
// kept here too so InfoPanel can match its own background to whichever
// section is active without reaching into unrelated CSS modules.
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
] as const
