import { links } from './links'

export const siteContent = {
  name: 'James Usher',
  tagline:
    'SDET | QE Lead',
  resumeUrl: links.resume,
} as const

export const socialLinks = [
  { id: 'linkedin', label: 'LinkedIn', href: links.linkedin },
  { id: 'github', label: 'GitHub', href: links.github },
  { id: 'email', label: 'Email', href: `mailto:${links.email}` },
] as const
