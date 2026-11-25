// The page's sections, in order. Drives the top bar's links (inline on
// desktop, in the hamburger menu below that), the left rail's section dots,
// and each section's visible title.
export const sections = [
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'case-studies', label: 'Case Studies' },
] as const

export type SectionId = (typeof sections)[number]['id']

export function getSectionLabel(id: SectionId): string {
  return sections.find((section) => section.id === id)!.label
}
