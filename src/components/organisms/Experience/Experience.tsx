import { sections } from '../../../content/navigation'
import { experience } from '../../../content/experience'
import Heading from '../../atoms/Heading/Heading'
import Badge from '../../atoms/Badge/Badge'
import styles from './Experience.module.css'

const sectionLabel = sections.find((section) => section.id === 'experience')!.label

function Experience() {
  return (
    <section id="experience" aria-label={sectionLabel}>
      <div className={styles.list}>
        {experience.map((entry) => (
          <a
            key={entry.id}
            className={styles.card}
            href={entry.companyUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className={styles.cardHeader}>
              <div>
                <Heading level={2}>{entry.role}</Heading>
                <p className={styles.company}>{entry.company}</p>
              </div>
              <p className={styles.dates}>{entry.dates}</p>
            </div>

            <p className={styles.summary}>{entry.summary}</p>

            {entry.stack && (
              <div className={styles.stack}>
                {entry.stack.map((tech) => (
                  <Badge key={tech}>{tech}</Badge>
                ))}
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  )
}

export default Experience
