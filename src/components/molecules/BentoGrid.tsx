import BentoTile from './BentoTile'
import type { CaseStudy } from '../../content/caseStudies'

type BentoGridProps = {
  items: readonly CaseStudy[]
  onSelect: (id: string) => void
}

// Placeholder-thumbnail palette — see `.bento-gradient-*` in App.css.
const GRADIENT_CLASSES = [
  'bento-gradient-0',
  'bento-gradient-1',
  'bento-gradient-2',
  'bento-gradient-3',
] as const

// Derived from the case study's own id, not its position in the array, so
// reordering or resizing the grid never shuffles which tile gets which
// gradient.
function gradientClassForId(id: string): string {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return GRADIENT_CLASSES[hash % GRADIENT_CLASSES.length]
}

function BentoGrid({ items, onSelect }: BentoGridProps) {
  return (
    <div className="bento-grid">
      {items.map((item) => (
        <BentoTile
          key={item.id}
          size={item.size ?? '1x1'}
          thumbnail={{ image: item.image, gradientClassName: gradientClassForId(item.id) }}
          typeLabel={item.tags[0] ?? ''}
          title={item.title}
          summary={item.summary}
          onClick={() => onSelect(item.id)}
        />
      ))}
    </div>
  )
}

export default BentoGrid
