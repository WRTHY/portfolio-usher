import type { ReactNode } from 'react'
import Card from '../../atoms/Card/Card'
import styles from './TextCard.module.css'

type TextCardProps = {
  children: ReactNode
}

function TextCard({ children }: TextCardProps) {
  return (
    <Card tone="alt" className={styles.card}>
      {children}
    </Card>
  )
}

export default TextCard
