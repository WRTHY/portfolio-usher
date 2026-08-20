import { useId, useState } from 'react'
import { sections } from '../../../content/navigation'
import Badge from '../../atoms/Badge/Badge'
import Heading from '../../atoms/Heading/Heading'
import Modal from '../../molecules/Modal/Modal'
import { caseStudies } from '../../../content/caseStudies'
import styles from './CaseStudies.module.css'

const sectionLabel = sections.find((section) => section.id === 'case-studies')!.label

function CaseStudies() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const titleId = useId()

  const selected = caseStudies.find((caseStudy) => caseStudy.id === selectedId) ?? null

  return (
    <section id="case-studies" aria-label={sectionLabel}>
      <div className={styles.list}>
        {caseStudies.map((caseStudy) => (
          <button
            key={caseStudy.id}
            type="button"
            className={styles.card}
            onClick={() => setSelectedId(caseStudy.id)}
          >
            <Heading level={2}>{caseStudy.title}</Heading>
            <p className={styles.summary}>{caseStudy.summary}</p>
            <div className={styles.tags}>
              {caseStudy.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <span className={styles.affordance}>Read case study &rarr;</span>
          </button>
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
          <div className={styles.tags}>
            {selected.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <div className={styles.report}>
            <div>
              <h3>Problem</h3>
              <p>{selected.problem}</p>
            </div>
            <div>
              <h3>Approach</h3>
              <p>{selected.approach}</p>
            </div>
            <div>
              <h3>Outcome</h3>
              <p>{selected.outcome}</p>
            </div>
          </div>
        </Modal>
      )}
    </section>
  )
}

export default CaseStudies
