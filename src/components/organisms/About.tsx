import MediaText from '../molecules/MediaText'
import Heading from '../atoms/Heading'
import SectionWatermark from '../atoms/SectionWatermark'
import useOverscrollBump from '../../hooks/useOverscrollBump'
import { about, siteContent } from '../../content/site'
import { sections } from '../../content/navigation'
import profilePhoto from '../../assets/profile.png'
import styles from './About.module.css'

const watermarkText = sections.find((section) => section.id === 'about')!.label

function About() {
  const bumpRef = useOverscrollBump<HTMLElement>()

  return (
    <section id="about" ref={bumpRef}>
      <SectionWatermark text={watermarkText} />
      <MediaText imageSrc={profilePhoto} imageAlt={siteContent.name} contentClassName={styles.content}>
        <Heading>{about.intro}</Heading>
        {about.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </MediaText>
    </section>
  )
}

export default About
