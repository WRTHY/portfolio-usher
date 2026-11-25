import { contactCopy } from '../../../content/contact'
import { siteContent } from '../../../content/site'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <span>{contactCopy.builtWith}</span>
      <span>
        © {new Date().getFullYear()} {siteContent.name}
      </span>
    </footer>
  )
}

export default Footer
