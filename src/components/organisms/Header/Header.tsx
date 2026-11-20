import { useEffect, useState } from 'react'
import Nav from '../../molecules/Nav/Nav'
import { cx } from '../../../utils/classNames'
import styles from './Header.module.css'

// Sticky at the top at every width. The hairline under it only appears once
// the page has scrolled, so the bar sits flush with the hero at rest.
function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled)}>
      <Nav />
    </header>
  )
}

export default Header
