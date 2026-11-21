import TextCard from '../../molecules/TextCard/TextCard'
import SkillsAndTools from '../../molecules/SkillsAndTools/SkillsAndTools'
import SectionBody from '../../molecules/SectionBody/SectionBody'
import SectionHeader from '../../molecules/SectionHeader/SectionHeader'
import ReadMoreText from '../../molecules/ReadMoreText/ReadMoreText'
import { getSectionLabel } from '../../../content/navigation'
import { about } from '../../../content/site'
import styles from './About.module.css'

const sectionLabel = getSectionLabel('about')

function About() {
  return (
    <section id="about" aria-labelledby="about-heading">
      <SectionHeader id="about-heading" title={sectionLabel} />
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
