export type TileSize = '1x1' | '1x2' | '2x1' | '2x2'

export type CaseStudy = {
  id: string
  title: string
  summary: string
  tags: readonly string[]
  problem: string
  approach: string
  outcome: string
  /** Bento grid tile size — see the `.bento-tile--*` rules in App.css. Defaults to '1x1' when omitted. */
  size?: TileSize
  /** Real thumbnail image, once one exists. Falls back to a gradient placeholder. */
  image?: string
}

export const caseStudies: readonly CaseStudy[] = [
  {
    id: 'placeholder-one',
    title: 'Placeholder case study one',
    summary: 'A one-line summary of the problem and outcome, shown on the card.',
    tags: ['Placeholder', 'Tag'],
    problem: 'Placeholder — what was broken, missing, or needed, and why it mattered.',
    approach:
      'Placeholder — what was actually built or decided, and the trade-offs weighed along the way.',
    outcome: 'Placeholder — what changed as a result, ideally with a number attached.',
    size: '2x2',
  },
  {
    id: 'placeholder-two',
    title: 'Placeholder case study two',
    summary: 'A one-line summary of the problem and outcome, shown on the card.',
    tags: ['Placeholder', 'Tag'],
    problem: 'Placeholder — what was broken, missing, or needed, and why it mattered.',
    approach:
      'Placeholder — what was actually built or decided, and the trade-offs weighed along the way.',
    outcome: 'Placeholder — what changed as a result, ideally with a number attached.',
  },
  {
    id: 'placeholder-three',
    title: 'Placeholder case study three',
    summary: 'A one-line summary of the problem and outcome, shown on the card.',
    tags: ['Placeholder', 'Tag'],
    problem: 'Placeholder — what was broken, missing, or needed, and why it mattered.',
    approach:
      'Placeholder — what was actually built or decided, and the trade-offs weighed along the way.',
    outcome: 'Placeholder — what changed as a result, ideally with a number attached.',
    size: '1x2',
  },
  {
    id: 'placeholder-four',
    title: 'Placeholder case study four',
    summary: 'A one-line summary of the problem and outcome, shown on the card.',
    tags: ['Placeholder', 'Tag'],
    problem: 'Placeholder — what was broken, missing, or needed, and why it mattered.',
    approach:
      'Placeholder — what was actually built or decided, and the trade-offs weighed along the way.',
    outcome: 'Placeholder — what changed as a result, ideally with a number attached.',
    size: '2x1',
  },
] as const
