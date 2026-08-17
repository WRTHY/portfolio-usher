type SectionWatermarkProps = {
  text: string
}

function SectionWatermark({ text }: SectionWatermarkProps) {
  return (
    <span className="section-watermark" aria-hidden="true">
      {text}
    </span>
  )
}

export default SectionWatermark
