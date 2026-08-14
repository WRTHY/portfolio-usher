type FramedImageProps = {
  src: string
  alt: string
  className?: string
}

function FramedImage({ src, alt, className }: FramedImageProps) {
  return (
    <div className={['framed-image', className].filter(Boolean).join(' ')}>
      <img src={src} alt={alt} />
    </div>
  )
}

export default FramedImage
