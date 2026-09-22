import type { SkillColorway } from '../../../styles/syntaxPalette'
import { toolCategories } from './toolCategories'

type SkillPosition = {
  colorway: SkillColorway
  // Where this tool sits in the Skills & Tools grid's reading order.
  rank: number
}

// Leaves room for each category's tools to rank inside its own block.
const CATEGORY_STRIDE = 1000

// Every tool in the Skills & Tools grid, keyed by lowercase name, so a pill
// elsewhere on the site picks up the same category color and ordering.
const positionByName = new Map<string, SkillPosition>(
  toolCategories.flatMap((category, categoryIndex) =>
    category.tools.map(
      (tool, toolIndex) =>
        [
          tool.name.toLowerCase(),
          { colorway: category.colorway, rank: categoryIndex * CATEGORY_STRIDE + toolIndex },
        ] as const,
    ),
  ),
)

// Labels that name a grid tool differently - they borrow that tool's slot.
const nameAliases: Record<string, string> = {
  'react native testing library': 'rntl',
  apidog: 'postman',
  cucumber: 'selenium',
}

// Tools used in Experience / Case Studies that aren't in the grid at all.
// They sort to the end of their category.
const extraTools: Record<string, SkillColorway> = {
  sqlite: 'languages',
  launchdarkly: 'devops',
  bugsnag: 'devops',
  firebase: 'devops',
}

function lookup(name: string): SkillPosition | undefined {
  const key = name.trim().toLowerCase()
  const known = positionByName.get(nameAliases[key] ?? key)
  if (known) return known

  const colorway = extraTools[key]
  if (!colorway) return undefined
  const categoryIndex = toolCategories.findIndex((category) => category.colorway === colorway)
  return { colorway, rank: categoryIndex * CATEGORY_STRIDE + CATEGORY_STRIDE - 1 }
}

// Compound labels ("TypeScript/JavaScript", "JavaScript (Node.js, React
// Native)") resolve by their first named tool.
function skillPosition(label: string): SkillPosition | undefined {
  return lookup(label) ?? lookup(label.split(/[/(]/)[0])
}

// Resolves a pill label to its Skills & Tools category. Returns undefined
// for non-tool tags like "Leadership", which keep the default accent Badge.
export function skillColorway(label: string): SkillColorway | undefined {
  return skillPosition(label)?.colorway
}

// Orders labels the way the Skills & Tools grid does. Non-tool tags go
// last, keeping their original relative order (Array.sort is stable).
export function sortBySkillOrder(labels: readonly string[]): string[] {
  const rankOf = (label: string) => skillPosition(label)?.rank ?? Number.POSITIVE_INFINITY
  return [...labels].sort((a, b) => rankOf(a) - rankOf(b))
}
