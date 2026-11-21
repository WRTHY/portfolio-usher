import { useCallback, useEffect, useRef, useState } from 'react'
import { FaArrowDown, FaCrosshairs } from 'react-icons/fa6'
import Button from '../../atoms/Button/Button'
import Switch from '../../atoms/Switch/Switch'
import SpringName from '../../molecules/SpringName/SpringName'
import RunReport from '../../molecules/RunReport/RunReport'
import LocatorInspector from '../../molecules/LocatorInspector/LocatorInspector'
import { OPENER_DONE_EVENT, introRequested } from '../../../utils/intro'
import { hero } from '../../../content/hero'
import { siteContent } from '../../../content/site'
import { links } from '../../../content/links'
import { locatorAttrs } from '../../../utils/locatorAttrs'
import { cx } from '../../../utils/classNames'
import styles from './Hero.module.css'

const RUN_LABEL = 'Career highlights, formatted as a test run'

// The page's first screen: name, pitch, the two actions and availability on
// one side; the opener's test run docked on the other, under the Pick locator
// switch. Turning the switch on lets visitors inspect the hero (and the top
// bar) like a locator picker - see LocatorInspector.
//
// onNameGoneChange: reports whether the big name has scrolled up under the
// sticky top bar, so the page can hand the name over to the bar (see
// Header's showName). The hero watches its own <h1>, so the watch re-attaches
// whenever the hero re-renders it (including hot reloads in development).
type HeroProps = {
  onNameGoneChange?: (gone: boolean) => void
}

function Hero({ onNameGoneChange }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const switchRef = useRef<HTMLButtonElement>(null)
  const [picked, setPicked] = useState<HTMLElement | null>(null)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    const name = heroRef.current?.querySelector('h1')
    if (!name || !onNameGoneChange) return
    const navHeight =
      parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 64
    // Watches the band below the bar: the name counts as gone once its
    // bottom edge has passed up under the bar.
    const observer = new IntersectionObserver(
      ([entry]) => onNameGoneChange(!entry.isIntersecting && entry.boundingClientRect.bottom < navHeight),
      { rootMargin: `-${navHeight}px 0px 0px 0px` },
    )
    observer.observe(name)
    return () => observer.disconnect()
  }, [onNameGoneChange])

  // Pulse the switch twice once the page is showing, so it gets noticed.
  useEffect(() => {
    let timer = 0
    const showHint = () => {
      timer = window.setTimeout(() => setHint(true), 1600)
    }
    if (introRequested()) window.addEventListener(OPENER_DONE_EVENT, showHint, { once: true })
    else showHint()
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener(OPENER_DONE_EVENT, showHint)
    }
  }, [])

  const stopPicking = useCallback(() => setPicked(null), [])
  const togglePicking = (on: boolean) => {
    setHint(false)
    setPicked(on ? (heroRef.current?.querySelector<HTMLElement>('h1') ?? null) : null)
  }

  return (
    <section id="top" ref={heroRef} className={styles.hero} aria-labelledby="hero-name">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <SpringName
            id="hero-name"
            name={siteContent.name}
            {...locatorAttrs("getByRole('heading', { level: 1 })", `toHaveAccessibleName('${siteContent.name}')`)}
          />
          <p
            className={styles.lead}
            {...locatorAttrs("getByText('QA Lead & SDET. I walk into teams')", `toContainText('${hero.lead.highlight}')`)}
          >
            {hero.lead.before}
            <em>{hero.lead.highlight}</em>
            {hero.lead.after}
          </p>
          <div className={styles.actions}>
            <Button
              href={siteContent.resumeUrl}
              external
              {...locatorAttrs(
                "getByRole('link', { name: 'Download resume' })",
                `toHaveAttribute('href', '${siteContent.resumeUrl}')`,
              )}
            >
              Download resume
              <FaArrowDown aria-hidden="true" />
            </Button>
            <Button
              href={`mailto:${links.email}`}
              variant="ghost"
              {...locatorAttrs("getByRole('link', { name: 'Email me' })", "toHaveAttribute('href', /^mailto:/)")}
            >
              Email me
            </Button>
          </div>
          <p
            className={styles.status}
            {...locatorAttrs("getByText('Open to QA Lead and SDET roles')", 'toBeVisible()')}
          >
            <i className={styles.dot} aria-hidden="true" />
            {hero.status}
          </p>
        </div>

        <div className={styles.side}>
          <div className={styles.pickRow}>
            <span className={styles.pickHint} id="pick-hint">
              {hero.pickHint}
            </span>
            <Switch
              ref={switchRef}
              checked={picked !== null}
              onChange={togglePicking}
              icon={<FaCrosshairs aria-hidden="true" />}
              describedBy="pick-hint"
              className={cx(hint && styles.hint)}
              {...locatorAttrs("getByRole('switch', { name: 'Pick locator' })", 'toBeChecked()')}
            >
              Pick locator
            </Switch>
          </div>
          <RunReport
            label={RUN_LABEL}
            spec={hero.run.spec}
            workers={hero.run.workers}
            results={hero.run.results}
            flaky={hero.run.flaky}
            duration={hero.run.duration}
            {...locatorAttrs(`getByRole('figure', { name: '${RUN_LABEL}' })`, `toContainText('${hero.run.results.length} passed')`)}
          />
        </div>
      </div>

      <LocatorInspector
        picked={picked}
        onPick={setPicked}
        onExit={stopPicking}
        scopeRef={heroRef}
        returnFocusRef={switchRef}
      />
    </section>
  )
}

export default Hero
