import type { FocusEventHandler } from 'react'
import { FaPlus } from 'react-icons/fa6'
import { cx } from '../../../utils/classNames'
import styles from './ExpandToggle.module.css'

type ExpandToggleProps = {
  expanded: boolean
  onToggle: () => void
  /** id of the region this button shows and hides. */
  controls: string
  /** Accessible name, e.g. "Details: QA Lead / Senior SDET". */
  label: string
  className?: string
  onFocus?: FocusEventHandler<HTMLButtonElement>
  onBlur?: FocusEventHandler<HTMLButtonElement>
}

// The round "+" that expands a row in place; it turns into a "×" while open.
// A real disclosure button (aria-expanded / aria-controls), so the rest of
// the row can keep its own links.
function ExpandToggle({ expanded, onToggle, controls, label, className, onFocus, onBlur }: ExpandToggleProps) {
  return (
    <button
      type="button"
      className={cx(styles.toggle, className)}
      aria-expanded={expanded}
      aria-controls={controls}
      aria-label={label}
      onClick={onToggle}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      <FaPlus aria-hidden="true" />
    </button>
  )
}

export default ExpandToggle
