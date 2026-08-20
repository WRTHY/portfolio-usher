import { useId, useState } from 'react'
import { sections } from '../../../content/navigation'
import Badge from '../../atoms/Badge/Badge'
import BentoGrid from '../../molecules/BentoGrid/BentoGrid'
import Modal from '../../molecules/Modal/Modal'
import { caseStudies } from '../../../content/caseStudies'
import './CaseStudies.module.css'

const sectionLabel = sections.find((section) => section.id === 'case-studies')!.label

function CaseStudies() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const titleId = useId()

  const selected = caseStudies.find((caseStudy) => caseStudy.id === selectedId) ?? null

  return (
    <section id="case-studies" aria-label={sectionLabel}>
      <BentoGrid items={caseStudies} onSelect={setSelectedId} />

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
