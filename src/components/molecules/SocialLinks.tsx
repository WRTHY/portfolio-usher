import type { IconType } from 'react-icons'
import { FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa6'
import SocialIcon from '../atoms/SocialIcon'
import { socialLinks } from '../../content/site'

const icons: Record<string, IconType> = {
  linkedin: FaLinkedin,
  github: FaGithub,
  email: FaEnvelope,
}

function SocialLinks() {
  return (
    <ul className="social-links">
      {socialLinks.map((link) => (
        <li key={link.id}>
          <SocialIcon href={link.href} label={link.label} icon={icons[link.id]} />
        </li>
      ))}
    </ul>
  )
}

export default SocialLinks
