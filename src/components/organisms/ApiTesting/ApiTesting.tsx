import { useState } from 'react'
import { FaGithub } from 'react-icons/fa6'
import { SiPostman } from 'react-icons/si'
import { PlaywrightIcon } from '../../atoms/icons/BrandIcons'
import Badge from '../../atoms/Badge/Badge'
import Card from '../../atoms/Card/Card'
import Heading from '../../atoms/Heading/Heading'
import CopyButton from '../../atoms/CopyButton/CopyButton'
import CodeBlock from '../../molecules/CodeBlock/CodeBlock'
import ParticleBackground from '../../molecules/ParticleBackground/ParticleBackground'
import SectionBody from '../../molecules/SectionBody/SectionBody'
import SegmentedControl from '../../molecules/SegmentedControl/SegmentedControl'
import type { SegmentedControlOption } from '../../molecules/SegmentedControl/SegmentedControl'
import { getSectionLabel } from '../../../content/navigation'
import { apiTestingIntro, apiTestingExamples } from '../../../content/apiTesting'
import { links } from '../../../content/links'
import styles from './ApiTesting.module.css'

const sectionLabel = getSectionLabel('api-testing')

type ApiTool = 'playwright' | 'postman'

// react-icons' bundled Simple Icons set has no Playwright mark (same finding
// as FrameworkSwitcher/frameworkOptions.tsx), so this reuses the same real
// Playwright mark the Skills & Tools grid uses (BrandIcons' iconify-sourced
// PlaywrightIcon) instead of leaving it text-only.
//
// That icon renders as a <span> sized via an inline style (1em, set by
// @iconify/react) rather than an <svg>'s width/height attributes — inline
// styles beat any external CSS class, so it can't share SegmentedControl's
// `svg { width/height }` sizing rule the way SiPostman's react-icons svg
// does. .toolIcon instead sets font-size to match that rule's pixel values;
// the icon's own 1em then resolves against it, same trick SkillsAndTools
// uses for this exact icon (see SkillsAndTools.module.css's .iconWrap).
const toolOptions: SegmentedControlOption<ApiTool>[] = [
  { value: 'postman', label: 'Postman', icon: <SiPostman aria-hidden="true" /> },
  {
    value: 'playwright',
    label: 'Playwright',
    icon: (
      <span className={styles.toolIcon}>
        <PlaywrightIcon aria-hidden="true" />
      </span>
    ),
  },
]

function ApiTesting() {
  const [tool, setTool] = useState<ApiTool>('postman')

  return (
    <section id="api-testing" className="flush-section" aria-label={sectionLabel}>
      <ParticleBackground variant="api-testing" />
      <SectionBody gap={16}>
        <Card tone="alt" className={styles.explainer}>
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

        <SegmentedControl value={tool} onChange={setTool} options={toolOptions} ariaLabel="Testing tool" />

        {apiTestingExamples.map((example) => {
          const snippet = example[tool]
          return (
            <Card key={example.id} tone="alt" className={styles.exampleCard}>
              <div className={styles.exampleHeader}>
                <Badge>{example.tag}</Badge>
                <Heading level={2}>{example.title}</Heading>
              </div>
              <p className={styles.description}>{example.description}</p>
              <div className={styles.panel}>
                <div className={styles.panelRow}>
                  <span className={styles.filename}>{snippet.filename}</span>
                  <CopyButton text={snippet.code} />
                </div>
                <CodeBlock code={snippet.code} language={snippet.language} />
              </div>
            </Card>
          )
        })}
      </SectionBody>
    </section>
  )
}

export default ApiTesting
