import { forwardRef } from 'react'
import type { ReactNode } from 'react'
import { cx } from '../../../utils/classNames'
import type { DataAttributes } from '../../../utils/locatorAttrs'
import styles from './Switch.module.css'

type SwitchProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  /** Visible label; also the switch's accessible name. */
  children: ReactNode
  icon?: ReactNode
  describedBy?: string
  className?: string
} & DataAttributes

// An on/off switch (role="switch") styled as a pill with a sliding thumb.
const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  { checked, onChange, children, icon, describedBy, className, ...dataAttributes },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={describedBy}
      className={cx(styles.switch, className)}
      onClick={() => onChange(!checked)}
      {...dataAttributes}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
      <span className={styles.track} aria-hidden="true">
        <span className={styles.thumb} />
      </span>
    </button>
  )
})

export default Switch
