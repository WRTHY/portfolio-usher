import MediaText from '../../molecules/MediaText/MediaText'
import Heading from '../../atoms/Heading/Heading'
import TextCard from '../../molecules/TextCard/TextCard'
import useOverscrollBump from '../../../hooks/useOverscrollBump'
import { about, siteContent } from '../../../content/site'
import profilePhoto from '../../../assets/profile.png'
import styles from './About.module.css'

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
