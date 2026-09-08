import * as RadioGroup from '@radix-ui/react-radio-group'
import type { CSSProperties, ReactNode } from 'react'
import SoonBadge from '../../atoms/SoonBadge/SoonBadge'
import styles from './SegmentedControl.module.css'

export type SegmentedControlOption<T extends string> = {
  value: T
  label: string
  icon?: ReactNode
  disabled?: boolean
}

type SegmentedControlProps<T extends string> = {
  value: T
  onChange: (value: T) => void
  options: SegmentedControlOption<T>[]
  ariaLabel: string
}

// A RadioGroup, not Tabs: this picks a value rather than owning a tabpanel,
// so Tabs.Trigger would emit an aria-controls pointing at an id that never
// existed (an axe "aria-valid-attr-value" violation).
//
// The highlight is one absolutely-positioned sibling, not a per-item active
// background, so it can slide between segments. It's positioned from two CSS
// custom properties (segment count, active index) so the CSS needn't know
// how many options exist.
function SegmentedControl<T extends string>({
  value,
  onChange,
  options,
  ariaLabel,
}: SegmentedControlProps<T>) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  )

  // Slugified from ariaLabel so each instance gets unique test ids without
  // callers passing one in.
  const testIdPrefix = ariaLabel.toLowerCase().replace(/[^a-z0-9]+/g, '-')

  return (
    <RadioGroup.Root
      value={value}
      onValueChange={(next) => onChange(next as T)}
      className={styles.track}
      aria-label={ariaLabel}
      style={{ '--count': options.length } as CSSProperties}
    >
      <span
        className={styles.highlight}
        aria-hidden="true"
        style={{ '--index': activeIndex } as CSSProperties}
      />
      {options.map((option) => (
        <RadioGroup.Item
          key={option.value}
          value={option.value}
          className={styles.segment}
          disabled={option.disabled}
          data-testid={`${testIdPrefix}-${option.value}`}
        >
          {option.icon}
          {option.label}
          {option.disabled && <SoonBadge />}
        </RadioGroup.Item>
      ))}
    </RadioGroup.Root>
  )
}

export default SegmentedControl
