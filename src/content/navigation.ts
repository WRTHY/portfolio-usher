// The page's sections, in order. Drives the top bar's links (inline on
// desktop, in the hamburger menu below that), the left rail's section dots,
// and each section's visible title.
export const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'case-studies', label: 'Case Studies' },
  { id: 'code-samples', label: 'Automation Examples' },
  { id: 'api-testing', label: 'API Testing' },
] as const

export type SectionId = (typeof sections)[number]['id']

export function getSectionLabel(id: SectionId): string {
  return sections.find((section) => section.id === id)!.label
}
