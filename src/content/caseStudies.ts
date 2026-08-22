export type CaseStudy = {
  id: string
  title: string
  summary: string
  tags: readonly string[]
  problem: string
  approach: string
  futureIterations?: string
  outcome: string
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
    futureIterations:
      'Placeholder — what a follow-up pass would tackle next, if the scope were extended.',
    outcome: 'Placeholder — what changed as a result, ideally with a number attached.',
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
  },
] as const
