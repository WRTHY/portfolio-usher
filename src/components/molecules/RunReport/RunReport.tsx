import type { CSSProperties } from 'react'
import { FaCheck } from 'react-icons/fa6'
import { cx } from '../../../utils/classNames'
import type { DataAttributes } from '../../../utils/locatorAttrs'
import type { RunResult } from '../../../content/hero'
import styles from './RunReport.module.css'

type RunReportProps = {
  label: string
  spec: string
  workers: string
  results: readonly RunResult[]
  flaky: number
  duration: string
  className?: string
} & DataAttributes

// The opener's test run, docked in the hero as a dark terminal panel: one
// passing line per career outcome, then a pass/flaky/duration footer.
function RunReport({
  label,
  spec,
  workers,
  results,
  flaky,
  duration,
  className,
  ...dataAttributes
}: RunReportProps) {
  return (
    <figure className={cx(styles.report, className)} aria-label={label} {...dataAttributes}>
      <div className={styles.bar}>
        <span>{spec}</span>
        <span>{workers}</span>
      </div>
      <ol className={styles.results}>
        {results.map((result, i) => (
          <li key={result.strong} style={{ '--i': i } as CSSProperties}>
            <FaCheck className={styles.mark} aria-hidden="true" />
            <span>
              {result.text}
              <b>{result.strong}</b>
            </span>
            <small>{result.ms}ms</small>
          </li>
        ))}
      </ol>
      <figcaption className={styles.summary}>
        <span className={styles.passed}>{results.length} passed</span>
        <span>{flaky} flaky</span>
        <span>{duration}</span>
      </figcaption>
    </figure>
  )
}

export default RunReport
