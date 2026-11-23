import type { ReactNode } from 'react'

type HeadingProps = {
  level?: 1 | 2 | 3
  id?: string
  className?: string
  children: ReactNode
}

function Heading({ level = 2, id, className, children }: HeadingProps) {
  const Tag = `h${level}` as const
  return (
    <Tag id={id} className={className}>
      {children}
    </Tag>
  )
}

export default Heading
