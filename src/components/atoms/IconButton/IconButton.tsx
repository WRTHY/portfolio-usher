import type { CSSProperties, ReactNode } from 'react'
import styles from './IconButton.module.css'

type IconButtonProps = {
  children: ReactNode
  onClick: () => void
  ariaLabel: string
  size?: number
  testId?: string
}

function IconButton({ children, onClick, ariaLabel, size, testId }: IconButtonProps) {
  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label={ariaLabel}
      style={size ? ({ fontSize: size } as CSSProperties) : undefined}
      data-testid={testId}
    >
      {children}
    </button>
  )
}

export default IconButton
