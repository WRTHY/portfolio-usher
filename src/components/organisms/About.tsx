import MediaText from '../molecules/MediaText'
import Heading from '../atoms/Heading'
import useOverscrollBump from '../../hooks/useOverscrollBump'
import { about, siteContent } from '../../content/site'
import profilePhoto from '../../assets/profile.png'

function About() {
  const bumpRef = useOverscrollBump<HTMLElement>()

  return (
    <section id="about" ref={bumpRef}>
      <MediaText imageSrc={profilePhoto} imageAlt={siteContent.name}>
        <Heading>{about.intro}</Heading>
        {about.paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </MediaText>
    </section>
  )
}

export default About
