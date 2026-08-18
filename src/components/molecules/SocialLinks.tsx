import type { IconType } from 'react-icons'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6'
import SocialIcon from '../atoms/SocialIcon'
import { socialLinks } from '../../content/site'
import styles from './SocialLinks.module.css'

const icons: Record<string, IconType> = {
  linkedin: FaLinkedin,
  github: FaGithub,
  email: FaEnvelope,
}

type SocialLinksProps = {
  className?: string
}

function SocialLinks({ className }: SocialLinksProps) {
  return (
    <ul className={[styles.list, className].filter(Boolean).join(' ')}>
      {socialLinks.map((link) => (
        <li key={link.id}>
          <SocialIcon href={link.href} label={link.label} icon={icons[link.id]} />
        </li>
      ))}
    </ul>
  )
}

export default SocialLinks
