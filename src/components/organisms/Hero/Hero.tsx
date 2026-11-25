import { useCallback, useEffect, useRef, useState } from 'react'
import { FaArrowDown, FaCrosshairs, FaXmark } from 'react-icons/fa6'
import Button from '../../atoms/Button/Button'
import Reveal from '../../atoms/Reveal/Reveal'
import Switch from '../../atoms/Switch/Switch'
import SpringName from '../../molecules/SpringName/SpringName'
import RunReport from '../../molecules/RunReport/RunReport'
import LocatorInspector from '../../molecules/LocatorInspector/LocatorInspector'
import { hero } from '../../../content/hero'
import { siteContent } from '../../../content/site'
import { locatorAttrs } from '../../../utils/locatorAttrs'
import { cx } from '../../../utils/classNames'
import styles from './Hero.module.css'

const RUN_LABEL = 'Career highlights, formatted as a test run'

// The page's first screen: name, pitch and the resume download on one side;
// availability and the opener's test run, docked, on the other. An easter
// egg: clicking a letter of the name unfolds the Pick locator switch under
// it, and it can be folded away again. Turning it on lets visitors inspect
// the hero (and the top bar) like a locator picker - see LocatorInspector.
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
  const [pickerFound, setPickerFound] = useState(false)

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

  // Found: the switch unfolds and pulses twice, so it gets noticed.
  const revealPicker = () => {
    if (pickerFound) return
    setPickerFound(true)
    setHint(true)
  }

  // Folded away again, which also stops any picking.
  const hidePicker = () => {
    setPicked(null)
    setHint(false)
    setPickerFound(false)
  }

  const stopPicking = useCallback(() => setPicked(null), [])
  const togglePicking = (on: boolean) => {
    setHint(false)
    setPicked(on ? (heroRef.current?.querySelector<HTMLElement>('h1') ?? null) : null)
  }

  return (
    <section id="top" ref={heroRef} className={styles.hero} aria-labelledby="hero-name">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <div>
            <SpringName
              id="hero-name"
              name={siteContent.name}
              onLetterClick={revealPicker}
              {...locatorAttrs("getByRole('heading', { level: 1 })", `toHaveAccessibleName('${siteContent.name}')`)}
            />
            <Reveal open={pickerFound} className={styles.pickFold}>
              <div className={styles.pickRow} data-testid="pick-row">
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
                <span className={styles.pickHint} id="pick-hint">
                  {hero.pickHint}
                </span>
                <button type="button" className={styles.pickHide} onClick={hidePicker} aria-label="Hide the locator picker">
                  <FaXmark aria-hidden="true" />
                  {hero.pickHide}
                </button>
              </div>
            </Reveal>
          </div>
          <p
            className={styles.lead}
            {...locatorAttrs("getByText('Startup QA Lead & SDET')", "toContainText('Quality wrought from Chaos through Consistency')")}
          >
            {hero.lead.map((part, i) => (part.mark ? <em key={i}>{part.text}</em> : part.text))}
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
          </div>
        </div>

        <div className={styles.side}>
          <p
            className={styles.status}
            {...locatorAttrs("getByText('Open to QA Lead and SDET roles')", 'toBeVisible()')}
          >
            <i className={styles.dot} aria-hidden="true" />
            {hero.status}
          </p>
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
