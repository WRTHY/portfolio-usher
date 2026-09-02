import { FaGithub } from 'react-icons/fa6'
import Badge from '../../atoms/Badge/Badge'
import Card from '../../atoms/Card/Card'
import Heading from '../../atoms/Heading/Heading'
import CopyButton from '../../atoms/CopyButton/CopyButton'
import CodeBlock from '../../molecules/CodeBlock/CodeBlock'
import ParticleBackground from '../../molecules/ParticleBackground/ParticleBackground'
import SectionBody from '../../molecules/SectionBody/SectionBody'
import { getSectionLabel } from '../../../content/navigation'
import { apiTestingIntro, apiTestingExamples } from '../../../content/apiTesting'
import { links } from '../../../content/links'
import styles from './ApiTesting.module.css'

const sectionLabel = getSectionLabel('api-testing')

function ApiTesting() {
  return (
    <section id="api-testing" className="flush-section" aria-label={sectionLabel}>
      <ParticleBackground variant="api-testing" />
      <SectionBody gap={16}>
        <Card className={styles.explainer}>
          <Badge variant="outline-accent">Static preview - full suite lives in its own repo</Badge>
          {apiTestingIntro.paragraphs.map((paragraph, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <p key={index}>{paragraph}</p>
          ))}
          <a
            className={styles.repoLink}
            href={links.apiTestingRepo}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub aria-hidden="true" />
            View the API testing repo on GitHub
          </a>
        </Card>

        {apiTestingExamples.map((example) => (
          <Card key={example.id} className={styles.exampleCard}>
            <div className={styles.exampleHeader}>
              <Badge>{example.tag}</Badge>
              <Heading level={2}>{example.title}</Heading>
            </div>
            <p className={styles.description}>{example.description}</p>
            <div className={styles.panel}>
              <div className={styles.panelRow}>
                <span className={styles.filename}>{example.filename}</span>
                <CopyButton text={example.code} />
              </div>
              <CodeBlock code={example.code} language={example.language} />
            </div>
          </Card>
        ))}
      </SectionBody>
    </section>
  )
}

export default ApiTesting
