import TextCard from '../../molecules/TextCard/TextCard'
import SkillsAndTools from '../../molecules/SkillsAndTools/SkillsAndTools'
import ParticleBackground from '../../molecules/ParticleBackground/ParticleBackground'
import useOverscrollBump from '../../../hooks/useOverscrollBump'
import { sections } from '../../../content/navigation'
import { about } from '../../../content/site'
import styles from './About.module.css'

const sectionLabel = sections.find((section) => section.id === 'about')!.label

function About() {
  const bumpRef = useOverscrollBump<HTMLElement>()

  return (
    <section id="about" aria-label={sectionLabel} ref={bumpRef}>
      <ParticleBackground variant="about" />
      <div className={styles.content}>
        <TextCard>
          {about.paragraphs.map((paragraph, index) => (
            <p key={index}>
              {paragraph.map((segment, segmentIndex) =>
                typeof segment === 'string' ? (
                  segment
                ) : (
                  <a
                    key={segmentIndex}
                    className={styles.link}
                    href={segment.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {segment.text}
                  </a>
                ),
              )}
            </p>
          ))}
        </TextCard>
        <TextCard>
          <SkillsAndTools />
        </TextCard>
      </div>
    </section>
  )
}

export default About
