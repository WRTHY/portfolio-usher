import Heading from '../atoms/Heading'
import SectionWatermark from '../atoms/SectionWatermark'
import { sections } from '../../content/navigation'
import './CaseStudies.module.css'

const watermarkText = sections.find((section) => section.id === 'case-studies')!.label

function CaseStudies() {
  return (
    <section id="case-studies">
      <SectionWatermark text={watermarkText} />
      <Heading>Case Studies</Heading>
      <p>Placeholder — a few in-depth write-ups of real projects: problem, approach, outcome.</p>
    </section>
  )
}

export default CaseStudies
