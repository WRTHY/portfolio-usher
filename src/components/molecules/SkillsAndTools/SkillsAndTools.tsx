import { useId } from 'react'
import type { FocusEvent, PointerEvent } from 'react'
import { skillChipVars } from '../../../styles/syntaxPalette'
import { cx } from '../../../utils/classNames'
import { toolCategories } from './toolCategories'
import styles from './SkillsAndTools.module.css'

type SkillsAndToolsProps = {
  /** The tools a role above used. Only these can filter the ledger; the
   *  rest (used on this site, say) are shown but do nothing. */
  usedTools?: ReadonlySet<string>
  /** The tool the ledger is showing, previewed or picked. */
  active?: string | null
  /** The tool picked with a click or tap, which stays until cleared. */
  picked?: string | null
  onPreview?: (tool: string | null) => void
  onPick?: (tool: string | null) => void
}

// Every tool as a small chip, icon and name, grouped by category. In the
// Experience section it doubles as a filter: point at a tool (or pick it)
// and the ledger shows the roles that used it.
function SkillsAndTools({ usedTools, active = null, picked = null, onPreview, onPick }: SkillsAndToolsProps) {
  const baseId = useId()

  // Previews follow a mouse or keyboard focus, not a tap: a tap picks.
  const previewOnPointer = (tool: string) => (event: PointerEvent) => {
    if (event.pointerType === 'mouse') onPreview?.(tool)
  }
  const previewOnFocus = (tool: string) => (event: FocusEvent<HTMLButtonElement>) => {
    if (event.currentTarget.matches(':focus-visible')) onPreview?.(tool)
  }

  return (
    <div
      className={cx(styles.groups, active && styles.filtering)}
      onKeyDown={(event) => event.key === 'Escape' && picked && onPick?.(null)}
    >
      {toolCategories.map((category) => {
        const labelId = `${baseId}-${category.id}`
        return (
          <div key={category.id} className={styles.group}>
            <p id={labelId} className={styles.groupLabel}>
              {category.ariaLabel}
            </p>
            <ul className={styles.chips} aria-labelledby={labelId}>
              {category.tools.map((tool) => {
                const content = (
                  <>
                    <span className={styles.icon} aria-hidden="true">
                      {tool.icon}
                    </span>
                    {tool.name}
                  </>
                )
                return (
                  <li
                    key={tool.name}
                    className={cx(styles.chip, active === tool.name && styles.active)}
                    style={skillChipVars(category.colorway)}
                  >
                    {usedTools?.has(tool.name) ? (
                      <button
                        type="button"
                        className={styles.chipButton}
                        aria-pressed={picked === tool.name}
                        onClick={() => {
                          // A click decides it: picked, or cleared even under the pointer.
                          onPreview?.(null)
                          onPick?.(picked === tool.name ? null : tool.name)
                        }}
                        onPointerEnter={previewOnPointer(tool.name)}
                        onPointerLeave={() => onPreview?.(null)}
                        onFocus={previewOnFocus(tool.name)}
                        onBlur={() => onPreview?.(null)}
                      >
                        {content}
                      </button>
                    ) : (
                      <span className={styles.chipBody}>{content}</span>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default SkillsAndTools
