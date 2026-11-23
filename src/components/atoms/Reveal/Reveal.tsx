import type { ReactNode, Ref } from 'react'
import { cx } from '../../../utils/classNames'
import styles from './Reveal.module.css'

type RevealProps = {
  open: boolean
  id?: string
  className?: string
  ref?: Ref<HTMLDivElement>
  children: ReactNode
}

// A region that unfolds to its content's height when opened and folds away
// when closed, used by the ledgers' rows (Experience, Case Studies). Closed,
// it carries the real `hidden` attribute, so it's out of the page, the tab
// order and the accessibility tree, not just invisible.
function Reveal({ open, id, className, ref, children }: RevealProps) {
  return (
    <div id={id} ref={ref} className={cx(styles.reveal, className)} hidden={!open}>
      <div className={styles.inner}>{children}</div>
    </div>
  )
}

export default Reveal
