import Badge from '../atoms/Badge'
import type { TileSize } from '../../content/caseStudies'

type BentoTileThumbnail = {
  image?: string
  gradientClassName: string
}

type BentoTileProps = {
  size: TileSize
  thumbnail: BentoTileThumbnail
  typeLabel: string
  title: string
  summary: string
  onClick: () => void
}

function BentoTile({ size, thumbnail, typeLabel, title, summary, onClick }: BentoTileProps) {
  return (
    <button type="button" className={`bento-tile bento-tile--${size}`} onClick={onClick}>
      <div className={`bento-tile-thumb ${thumbnail.image ? '' : thumbnail.gradientClassName}`}>
        {thumbnail.image && <img src={thumbnail.image} alt="" />}
      </div>
      <div className="bento-tile-body">
        {typeLabel && <Badge>{typeLabel}</Badge>}
        <h3>{title}</h3>
        <p>{summary}</p>
      </div>
    </button>
  )
}

export default BentoTile
