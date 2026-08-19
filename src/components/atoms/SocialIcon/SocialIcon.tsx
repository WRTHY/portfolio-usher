import type { IconType } from 'react-icons'

type SocialIconProps = {
  href: string
  label: string
  icon: IconType
}

function SocialIcon({ href, label, icon: Icon }: SocialIconProps) {
  const isExternal = href.startsWith('http')

  return (
    <a
      href={href}
      aria-label={label}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noreferrer' : undefined}
    >
      <Icon aria-hidden="true" />
    </a>
  )
}

export default SocialIcon
