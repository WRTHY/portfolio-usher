import { cx } from '../../../utils/classNames'
import styles from './FramedImage.module.css'

type FramedImageProps = {
  src: string
  alt: string
  className?: string
}

function FramedImage({ src, alt, className }: FramedImageProps) {
  return (
    <div className={cx(styles.frame, className)}>
      <img src={src} alt={alt} />
    </div>
  )
}

export default FramedImage
