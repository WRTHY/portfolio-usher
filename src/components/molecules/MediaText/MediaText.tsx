import type { ReactNode } from 'react'
import FramedImage from '../../atoms/FramedImage/FramedImage'
import styles from './MediaText.module.css'

type MediaTextProps = {
  imageSrc: string
  imageAlt: string
  contentClassName?: string
  children: ReactNode
}

function MediaText({ imageSrc, imageAlt, contentClassName, children }: MediaTextProps) {
  return (
    <div className={styles.mediaText}>
      <FramedImage className={styles.image} src={imageSrc} alt={imageAlt} />
      <div className={[styles.content, contentClassName].filter(Boolean).join(' ')}>
        {children}
      </div>
    </div>
  )
}

export default MediaText
