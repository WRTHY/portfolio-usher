import Heading from '../atoms/Heading'

type HeroProps = {
  name: string
  tagline: string
}

function Hero({ name, tagline }: HeroProps) {
  return (
    <section id="hero" className="hero">
      <Heading level={1}>{name}</Heading>
      <p>{tagline}</p>
    </section>
  )
}

export default Hero
