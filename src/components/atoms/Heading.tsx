import type { ReactNode } from 'react'

type HeadingProps = {
  level?: 1 | 2
  children: ReactNode
}

function Heading({ level = 2, children }: HeadingProps) {
  const Tag = `h${level}` as const
  return <Tag>{children}</Tag>
}

export default Heading
