import type { ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
}

function Badge({ children }: BadgeProps) {
  return <span className="badge">{children}</span>
}

export default Badge
