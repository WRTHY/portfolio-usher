import Heading from '../../atoms/Heading/Heading'
import TextCard from '../../molecules/TextCard/TextCard'
import useOverscrollBump from '../../../hooks/useOverscrollBump'
import { sections } from '../../../content/navigation'
import { about } from '../../../content/site'
import styles from './About.module.css'

const sectionLabel = sections.find((section) => section.id === 'about')!.label

function About() {
  const bumpRef = useOverscrollBump<HTMLElement>()

  return (
    <section id="about" aria-label={sectionLabel} ref={bumpRef}>
      <div className={styles.content}>
        <TextCard>
          <Heading>{about.intro}</Heading>
          {about.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </TextCard>
      </div>
    </section>
  )
}

export default About
