import type { ReactNode } from 'react'
import FramedImage from '../atoms/FramedImage'

type MediaTextProps = {
  imageSrc: string
  imageAlt: string
  children: ReactNode
}

function MediaText({ imageSrc, imageAlt, children }: MediaTextProps) {
  return (
    <div className="media-text">
      <FramedImage className="media-text-image" src={imageSrc} alt={imageAlt} />
      <div className="media-text-content">{children}</div>
    </div>
  )
}

export default MediaText
