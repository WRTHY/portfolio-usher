import styles from './SectionWatermark.module.css'

type SectionWatermarkProps = {
  text: string
}

function SectionWatermark({ text }: SectionWatermarkProps) {
  return (
    <span className={styles.watermark} aria-hidden="true">
      {text}
    </span>
  )
}

export default SectionWatermark
