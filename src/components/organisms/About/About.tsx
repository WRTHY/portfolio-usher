import Heading from '../../atoms/Heading/Heading'
import useOverscrollBump from '../../../hooks/useOverscrollBump'
import { sections } from '../../../content/navigation'
import { about } from '../../../content/site'
import styles from './About.module.css'

const sectionLabel = sections.find((section) => section.id === 'about')!.label

function About() {
  const bumpRef = useOverscrollBump<HTMLElement>()

  return (
    <section id="about" aria-label={sectionLabel} ref={bumpRef}>
      {/* Image dropped for now — About may move elsewhere in the page; the
          profile photo comes back with whatever layout it lands in. */}
      <div className={styles.content}>
        <Heading>{about.intro}</Heading>
        {about.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    </section>
  )
}

export default About
