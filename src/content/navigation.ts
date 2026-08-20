export const sections = [
  { id: 'hero', label: 'Home', description: 'Intro and tagline.' },
  {
    id: 'experience',
    label: 'Experience',
    description: 'A card per role, with stack and impact.',
  },
  {
    id: 'case-studies',
    label: 'Case Studies',
    description: 'A bento grid of expandable write-ups (problem → approach → outcome).',
  },
  {
    id: 'code-samples',
    label: 'Automation Examples',
    description: 'Syntax-highlighted Playwright/Cypress snippets.',
  },
  { id: 'about', label: 'About', description: 'Background and links.' },
] as const
