import Heading from '../atoms/Heading'
import SectionWatermark from '../atoms/SectionWatermark'
import { sections } from '../../content/navigation'

const watermarkText = sections.find((section) => section.id === 'code-samples')!.label

function CodeSamples() {
  return (
    <section id="code-samples">
      <SectionWatermark text={watermarkText} />
      <Heading>Code Samples</Heading>
      <p>Placeholder — links to notable repos or embedded snippets that show how you code.</p>
    </section>
  )
}

export default CodeSamples
