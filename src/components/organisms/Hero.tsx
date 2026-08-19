import Button from '../atoms/Button'
import Heading from '../atoms/Heading'
import ParticleBackground from '../molecules/ParticleBackground'
import SocialLinks from '../molecules/SocialLinks'
import styles from './Hero.module.css'

type HeroProps = {
  name: string
  tagline: string
  resumeUrl: string
}

function Hero({ name, tagline, resumeUrl }: HeroProps) {
  return (
    <section id="hero" className={styles.hero}>
      <ParticleBackground />
      <div className={styles.content}>
        <Heading level={1}>{name}</Heading>
        <p>{tagline}</p>
        <SocialLinks className={styles.socialLinks} />
        <Button href={resumeUrl} external>
          My Resume
        </Button>
      </div>
    </section>
  )
}

export default Hero
