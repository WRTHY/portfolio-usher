import Badge from '../atoms/Badge'
import type { CaseStudy } from '../../content/caseStudies'

type CaseStudyCardProps = {
  caseStudy: CaseStudy
  onSelect: () => void
}

function CaseStudyCard({ caseStudy, onSelect }: CaseStudyCardProps) {
  return (
    <button type="button" className="case-study-card" onClick={onSelect}>
      <h3>{caseStudy.title}</h3>
      <p>{caseStudy.summary}</p>
      <div className="case-study-tags">
        {caseStudy.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </button>
  )
}

export default CaseStudyCard
