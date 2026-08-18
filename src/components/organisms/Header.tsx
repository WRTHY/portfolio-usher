import Nav from '../molecules/Nav'
import styles from './Header.module.css'

function Header() {
  return (
    <header className={styles.header}>
      <Nav />
    </header>
  )
}

export default Header
