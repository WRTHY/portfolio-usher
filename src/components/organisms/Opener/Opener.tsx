import { useCallback, useEffect, useRef, useState } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { cx } from '../../../utils/classNames'
import { hero, resultLine } from '../../../content/hero'
import { INTRO_SEEN_KEY, OPENER_DONE_EVENT, introRequested } from '../../../utils/intro'
import styles from './Opener.module.css'

const NOISE = '!<>-_\\/[]{}=+*^?#%&$'
const LINE_MS = 300
const FIRST_LINE_AT = 520
const LINE_GAP = 250

// One result line: its characters resolve left to right out of red noise,
// then the check mark springs in.
function ScrambleLine({ text, onDone }: { text: string; onDone: () => void }) {
  const resolvedRef = useRef<HTMLSpanElement>(null)
  const noiseRef = useRef<HTMLSpanElement>(null)
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  })

  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / LINE_MS)
      const shown = Math.floor(progress * text.length)
      let tail = ''
      for (let k = shown; k < Math.min(text.length, shown + 14); k++) {
        tail += text[k] === ' ' ? ' ' : NOISE[Math.floor(Math.random() * NOISE.length)]
      }
      if (resolvedRef.current) resolvedRef.current.textContent = text.slice(0, shown)
      if (noiseRef.current) noiseRef.current.textContent = progress < 1 ? tail : ''
      if (progress < 1) frame = requestAnimationFrame(tick)
      else onDoneRef.current()
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [text])

  return (
    <>
      <span ref={resolvedRef} />
      <span ref={noiseRef} className={styles.noise} />
    </>
  )
}

// The one-time intro: `npx playwright test james-usher.spec.ts` runs in a
// dark terminal, each career outcome resolves out of noise into a passing
// line, then the terminal wipes up to reveal the page. Any key or click
// skips it. On hand-off it adds `play` to <html> (which starts the name's
// letter pop and the run report's lines) and fires OPENER_DONE_EVENT.
function OpenerRun() {
  const { results, command } = hero.run
  const [metaShown, setMetaShown] = useState(false)
  const [linesShown, setLinesShown] = useState(0)
  const [linesDone, setLinesDone] = useState<boolean[]>(() => results.map(() => false))
  const [summaryShown, setSummaryShown] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)
  const finished = useRef(false)

  const finish = useCallback(() => {
    if (finished.current) return
    finished.current = true
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, '1')
    } catch {
      // Storage can be unavailable (private modes); the opener just replays.
    }
    setLeaving(true)
    window.setTimeout(() => {
      document.documentElement.classList.add('play')
      window.dispatchEvent(new Event(OPENER_DONE_EVENT))
    }, 180)
    window.setTimeout(() => {
      document.documentElement.classList.remove('intro')
      setGone(true)
    }, 820)
  }, [])

  useEffect(() => {
    const timers: number[] = []
    const later = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms))
    const end = FIRST_LINE_AT + results.length * LINE_GAP
    later(() => setMetaShown(true), 260)
    results.forEach((_, i) => later(() => setLinesShown(i + 1), FIRST_LINE_AT + i * LINE_GAP))
    later(() => setSummaryShown(true), end + 260)
    later(finish, end + 900)

    window.addEventListener('keydown', finish)
    window.addEventListener('click', finish)
    return () => {
      timers.forEach(clearTimeout)
      window.removeEventListener('keydown', finish)
      window.removeEventListener('click', finish)
    }
  }, [finish, results])

  if (gone) return null

  return (
    <div className={cx(styles.opener, leaving && styles.leaving)} aria-hidden="true" data-testid="opener">
      <div className={styles.run}>
        <p className={styles.command}>
          $ <b>{command}</b>
        </p>
        <p className={styles.meta}>{metaShown && `Running ${results.length} tests using 1 worker`}</p>
        <ol className={styles.lines}>
          {results.slice(0, linesShown).map((result, i) => (
            <li key={result.strong} className={cx(linesDone[i] && styles.done)}>
              <FaCheck className={styles.mark} />
              <span className={styles.text}>
                <ScrambleLine
                  text={resultLine(result)}
                  onDone={() => setLinesDone((done) => done.map((d, j) => (j === i ? true : d)))}
                />
              </span>
            </li>
          ))}
        </ol>
        <p className={cx(styles.summary, summaryShown && styles.on)}>
          {summaryShown && `${results.length} passed (${hero.run.duration})`}
        </p>
      </div>
      <button className={styles.skip} type="button" tabIndex={-1} onClick={finish}>
        skip intro
      </button>
    </div>
  )
}

function Opener() {
  const [active] = useState(introRequested)
  return active ? <OpenerRun /> : null
}

export default Opener
