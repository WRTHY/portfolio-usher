import type { ReactNode } from 'react'
import './Badge.module.css'

type BadgeProps = {
  children: ReactNode
}

function Badge({ children }: BadgeProps) {
  return <span className="badge">{children}</span>
}

export default Badge
