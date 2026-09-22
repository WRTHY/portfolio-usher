import TextCard from '../../molecules/TextCard/TextCard'
import SkillsAndTools from '../../molecules/SkillsAndTools/SkillsAndTools'
import ParticleBackground from '../../molecules/ParticleBackground/ParticleBackground'
import SectionBody from '../../molecules/SectionBody/SectionBody'
import ReadMoreText from '../../molecules/ReadMoreText/ReadMoreText'
import MobileInfoCard from '../MobileInfoCard/MobileInfoCard'
import useOverscrollBump from '../../../hooks/useOverscrollBump'
import { getSectionLabel } from '../../../content/navigation'
import { about } from '../../../content/site'
import styles from './About.module.css'

const sectionLabel = getSectionLabel('about')

function About() {
  const bumpRef = useOverscrollBump<HTMLElement>()

  return (
    <section id="about" className="flush-section" aria-label={sectionLabel} ref={bumpRef}>
      <MobileInfoCard label={sectionLabel} />
      <ParticleBackground variant="about" />
      <SectionBody>
        <TextCard>
          <ReadMoreText toggleClassName={styles.readMoreToggle}>
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
          </ReadMoreText>
        </TextCard>
        <TextCard>
          <SkillsAndTools />
        </TextCard>
      </SectionBody>
    </section>
  )
}

export default About
