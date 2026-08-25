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

// A RadioGroup, not Tabs — same reason as FrameworkSwitcher/LanguageTabs
// before it: this picks a value, it doesn't own a tabpanel, so Radix's
// Tabs.Trigger would emit an aria-controls pointing at an id that never
// existed (an axe "aria-valid-attr-value" violation).
//
// The highlight is a single absolutely-positioned sibling rather than a
// per-item "active" background, so it can slide between segments instead of
// popping. It's sized/positioned entirely from two CSS custom properties
// (segment count and active index) set here, so the CSS never needs to know
// how many options a given instance has.
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

  // Slugified from ariaLabel so every SegmentedControl instance (testing
  // type, framework, any future picker) gets unique, collision-free ids
  // without callers having to pass one in per option.
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
