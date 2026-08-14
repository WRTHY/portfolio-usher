import Heading from '../atoms/Heading'
import ParticleBackground from '../molecules/ParticleBackground'
import SocialLinks from '../molecules/SocialLinks'

type HeroProps = {
  name: string
  tagline: string
}

function Hero({ name, tagline }: HeroProps) {
  return (
    <section id="hero" className="hero">
      <ParticleBackground />
      <div className="hero-content">
        <Heading level={1}>{name}</Heading>
        <p>{tagline}</p>
        <SocialLinks />
      </div>
    </section>
  )
}

export default Hero
