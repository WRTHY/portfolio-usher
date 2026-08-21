import type { ReactNode } from 'react'
import styles from './TextCard.module.css'

type TextCardProps = {
  children: ReactNode
}

function TextCard({ children }: TextCardProps) {
  return <div className={styles.card}>{children}</div>
}

export default TextCard
