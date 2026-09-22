import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { cx } from '../../../utils/classNames'
import styles from './ReadMoreText.module.css'

type ReadMoreTextProps = {
  children: ReactNode
  collapsedLines?: number
}

// Mobile-only (see the module CSS's [data-viewport='mobile'] gate) - long
// text sections read as an unbroken wall on a phone screen, so this clips
// to a short preview with a toggle instead. Desktop has the horizontal
// room for the same paragraphs to read fine at full length, so the clamp
// is a no-op there - which is also why the toggle only renders once
// scrollHeight/clientHeight confirm the clamp is actually cutting
// something off, rather than a separate viewport check duplicating the
// CSS's own condition: on desktop (or on mobile if the content is already
// short enough to fit) there's nothing to detect, so it just never appears.
function ReadMoreText({ children, collapsedLines = 5 }: ReadMoreTextProps) {
  const [expanded, setExpanded] = useState(false)
  const [truncated, setTruncated] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = contentRef.current
    if (!el || expanded) return

    const checkTruncation = () => {
      setTruncated(el.scrollHeight > el.clientHeight + 1)
    }

    checkTruncation()

    const observer = new ResizeObserver(checkTruncation)
    observer.observe(el)
    return () => observer.disconnect()
  }, [expanded])

  return (
    <div>
      <div
        ref={contentRef}
        className={cx(styles.content, !expanded && styles.collapsed)}
        style={{ '--collapsed-lines': collapsedLines } as CSSProperties}
      >
        {children}
      </div>
      {truncated && (
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? 'Read less' : 'Read more'}
        </button>
      )}
    </div>
  )
}

export default ReadMoreText
