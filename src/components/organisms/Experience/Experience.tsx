import { getSectionLabel, getSectionTone } from '../../../content/navigation'
import { experience } from '../../../content/experience'
import Heading from '../../atoms/Heading/Heading'
import SkillBadge from '../../molecules/SkillBadge/SkillBadge'
import { sortBySkillOrder } from '../../molecules/SkillsAndTools/skillColorway'
import Card from '../../atoms/Card/Card'
import ParticleBackground from '../../molecules/ParticleBackground/ParticleBackground'
import SectionBody from '../../molecules/SectionBody/SectionBody'
import MobileInfoCard from '../MobileInfoCard/MobileInfoCard'
import styles from './Experience.module.css'

const sectionLabel = getSectionLabel('experience')
const sectionTone = getSectionTone('experience')

function Experience() {
  return (
    <section id="experience" className="flush-section" aria-label={sectionLabel}>
      <MobileInfoCard label={sectionLabel} tone={sectionTone} />
      <ParticleBackground variant="experience" />
      <SectionBody>
        {experience.map((entry) => (
          <Card
            key={entry.id}
            as="a"
            interactive
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
                {sortBySkillOrder(entry.stack).map((tech) => (
                  <SkillBadge key={tech} label={tech} />
                ))}
              </div>
            )}
          </Card>
        ))}
      </SectionBody>
    </section>
  )
}

export default Experience
