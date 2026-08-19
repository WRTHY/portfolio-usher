import styles from './SectionWatermark.module.css'

type SectionWatermarkProps = {
  text: string
}

function SectionWatermark({ text }: SectionWatermarkProps) {
  return (
    // data-a11y-decorative: a purpose-built hook for the e2e a11y suite
    // (see e2e/playwright/support/axe.ts) to exclude this from color-contrast
    // checks. It's WCAG 1.4.3's "incidental text" case — 10%-opacity
    // background typography with zero informational content beyond what the
    // real section heading already conveys, already aria-hidden — not a
    // contrast bug to fix by brightening it.
    <span className={styles.watermark} aria-hidden="true" data-a11y-decorative="true">
      {text}
    </span>
  )
}

export default SectionWatermark
