import Heading from '../atoms/Heading'
import useOverscrollBump from '../../hooks/useOverscrollBump'

function Contact() {
  const bumpRef = useOverscrollBump<HTMLElement>()

  return (
    <section id="contact" ref={bumpRef}>
      <Heading>Contact</Heading>
      <p>Placeholder — email, LinkedIn, GitHub, however you want people to reach you.</p>
    </section>
  )
}

export default Contact
