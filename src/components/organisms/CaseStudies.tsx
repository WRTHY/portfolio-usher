import { useId, useState } from 'react'
import Heading from '../atoms/Heading'
import Badge from '../atoms/Badge'
import CaseStudyCard from '../molecules/CaseStudyCard'
import Modal from '../molecules/Modal'
import { caseStudies } from '../../content/caseStudies'

function CaseStudies() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const titleId = useId()

  const selected = caseStudies.find((caseStudy) => caseStudy.id === selectedId) ?? null

  return (
    <section id="case-studies">
      <Heading>Case Studies</Heading>
      <div className="case-study-carousel">
        {caseStudies.map((caseStudy) => (
          <CaseStudyCard
            key={caseStudy.id}
            caseStudy={caseStudy}
            onSelect={() => setSelectedId(caseStudy.id)}
          />
        ))}
      </div>

      {selected && (
        <Modal titleId={titleId} onClose={() => setSelectedId(null)}>
          <button
            type="button"
            className="modal-close"
            onClick={() => setSelectedId(null)}
            aria-label="Close"
          >
            &times;
          </button>
          <h2 id={titleId}>{selected.title}</h2>
          <div className="case-study-tags">
            {selected.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <h3>Problem</h3>
          <p>{selected.problem}</p>
          <h3>Approach</h3>
          <p>{selected.approach}</p>
          <h3>Outcome</h3>
          <p>{selected.outcome}</p>
        </Modal>
      )}
    </section>
  )
}

export default CaseStudies
