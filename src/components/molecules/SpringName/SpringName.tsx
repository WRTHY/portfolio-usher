import type { CSSProperties } from 'react'
import { cx } from '../../../utils/classNames'
import type { DataAttributes } from '../../../utils/locatorAttrs'
import styles from './SpringName.module.css'

type SpringNameProps = {
  id: string
  name: string
  className?: string
  /** Called when any letter is clicked. */
  onLetterClick?: () => void
} & DataAttributes

// The hero's <h1>. Each letter is its own span so the name can spring in
// letter by letter once the opener hands off (the page's `play` class, see
// Opener.tsx) and bounce slightly under the pointer. Screen readers get the
// name once, from aria-label; the letter spans are hidden from them.
function SpringName({ id, name, className, onLetterClick, ...dataAttributes }: SpringNameProps) {
  let index = 0
  const words = name.split(' ')

  return (
    <h1 id={id} className={cx(styles.name, className)} aria-label={name} {...dataAttributes}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex}>
          <span className={styles.word} aria-hidden="true">
            {word.split('').map((letter) => {
              const i = index++
              return (
                <span key={i} className={styles.letter} style={{ '--i': i } as CSSProperties} onClick={onLetterClick}>
                  {letter}
                </span>
              )
            })}
          </span>
          {wordIndex < words.length - 1 && ' '}
        </span>
      ))}
    </h1>
  )
}

export default SpringName
