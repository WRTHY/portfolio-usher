import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'
import { cx } from '../../../utils/classNames'
import styles from './Card.module.css'

type CardOwnProps<T extends ElementType> = {
  as?: T
  tone?: 'base' | 'alt'
  interactive?: boolean
  className?: string
  children: ReactNode
}

type CardProps<T extends ElementType> = CardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>

// Shared box recipe for the site's "card" surfaces (border, radius, padding,
// the phone-width padding override, and the interactive hover border-color)
// — see Experience/CaseStudies/CodeSamples/TextCard, which previously
// hand-rolled an identical recipe each. Polymorphic via `as` since those
// consumers render it as an <a>, a <button>, and a plain <div>.
function Card<T extends ElementType = 'div'>({
  as,
  tone = 'base',
  interactive = false,
  className,
  children,
  ...rest
}: CardProps<T>) {
  const Tag = (as ?? 'div') as ElementType
  return (
    <Tag
      className={cx(styles.card, tone === 'alt' && styles.toneAlt, interactive && styles.interactive, className)}
      {...rest}
    >
      {children}
    </Tag>
  )
}

export default Card
