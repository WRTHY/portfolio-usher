import { links } from './links'

export const siteContent = {
  name: 'James Usher',
  tagline:
    'SDET | QE Lead',
  quickSummary :
    'From Chaos, Quality - I build testing from scratch so nothing ships broken',
  resumeUrl: '/James_Usher_Resume.pdf',
} as const

export const socialLinks = [
  { id: 'linkedin', label: 'LinkedIn', href: links.linkedin },
  { id: 'github', label: 'GitHub', href: links.github },
  { id: 'email', label: 'Email', href: `mailto:${links.email}` },
] as const
