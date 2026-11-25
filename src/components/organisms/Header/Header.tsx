import { useEffect, useState } from 'react'
import Nav from '../../molecules/Nav/Nav'
import { cx } from '../../../utils/classNames'
import styles from './Header.module.css'

type HeaderProps = {
  /** Show the bar's name. The page sets this once the hero's own name has
   *  scrolled up under the bar (see Hero's onNameGoneChange), so the name is
   *  never on screen twice. Defaults to shown for pages without a hero. */
  showName?: boolean
}

// Sticky at the top at every width. The hairline under it only appears once
// the page has scrolled, so the bar sits flush with the hero at rest.
function Header({ showName = true }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <header className={cx(styles.header, scrolled && styles.scrolled)}>
      <Nav showName={showName} />
    </header>
  )
}

export default Header
