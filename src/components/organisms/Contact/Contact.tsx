import type { IconType } from 'react-icons'
import { FaFileLines, FaGithub, FaLinkedin } from 'react-icons/fa6'
import { contactCopy } from '../../../content/contact'
import { links } from '../../../content/links'
import styles from './Contact.module.css'

const elsewhere: { label: string; href: string; icon: IconType }[] = [
  { label: 'LinkedIn', href: links.linkedin, icon: FaLinkedin },
  { label: 'GitHub', href: links.github, icon: FaGithub },
  { label: 'Resume', href: links.resume, icon: FaFileLines },
]

// The page's close: one line, the email address set large, the other ways
// to reach James, and a short note on life outside work.
function Contact() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-heading">
      <h2 id="contact-heading" className={styles.heading}>
        {contactCopy.heading}
      </h2>
      <a className={styles.mail} href={`mailto:${links.email}`}>
        {links.email}
      </a>
      <ul className={styles.elsewhere}>
        {elsewhere.map(({ label, href, icon: Icon }) => (
          <li key={label}>
            <a href={href} target="_blank" rel="noopener noreferrer">
              <Icon aria-hidden="true" />
              {label}
            </a>
          </li>
        ))}
      </ul>
      <p className={styles.aside}>{contactCopy.aside}</p>
    </section>
  )
}

export default Contact
