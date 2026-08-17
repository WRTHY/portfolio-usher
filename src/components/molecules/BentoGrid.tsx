import { useEffect, useRef, useState } from 'react'
import { FaChevronRight } from 'react-icons/fa6'
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollBack, setCanScrollBack] = useState(false)
  const [canScrollMore, setCanScrollMore] = useState(false)

  useEffect(() => {
    const grid = scrollRef.current
    if (!grid) return

    const updateScrollHints = () => {
      setCanScrollBack(grid.scrollLeft > 1)
      setCanScrollMore(grid.scrollWidth - grid.clientWidth - grid.scrollLeft > 1)
    }

    updateScrollHints()
    grid.addEventListener('scroll', updateScrollHints)
    window.addEventListener('resize', updateScrollHints)
    return () => {
      grid.removeEventListener('scroll', updateScrollHints)
      window.removeEventListener('resize', updateScrollHints)
    }
  }, [items])

  return (
    <div className="bento-grid-wrap">
      <div className="bento-grid" ref={scrollRef}>
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
      {canScrollBack && (
        // No arrow here: reaching this state already required the user to
        // scroll, so they already know there's more off this side. The
        // fade alone is enough — an arrow would be telling them something
        // they just demonstrated they know.
        <div className="bento-scroll-hint bento-scroll-hint--left" aria-hidden="true" />
      )}
      {canScrollMore && (
        <div className="bento-scroll-hint bento-scroll-hint--right" aria-hidden="true">
          <FaChevronRight />
        </div>
      )}
    </div>
  )
}

export default BentoGrid
