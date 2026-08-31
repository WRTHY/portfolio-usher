import { useState } from 'react'
import FrameworkSwitcher from '../../molecules/FrameworkSwitcher/FrameworkSwitcher'
import { frameworkOptionsByTestingType } from '../../molecules/FrameworkSwitcher/frameworkOptions'
import type { SelectableTestingType } from '../../molecules/FrameworkSwitcher/frameworkOptions'
import SegmentedControl from '../../molecules/SegmentedControl/SegmentedControl'
import type { SegmentedControlOption } from '../../molecules/SegmentedControl/SegmentedControl'
import { ComponentTestIcon, EndToEndIcon, PerformanceIcon } from '../../atoms/icons/TestingTypeIcons'
import Badge from '../../atoms/Badge/Badge'
import Card from '../../atoms/Card/Card'
import CodeFileTabs from '../../molecules/CodeFileTabs/CodeFileTabs'
import PanelFooter from '../../molecules/PanelFooter/PanelFooter'
import ParticleBackground from '../../molecules/ParticleBackground/ParticleBackground'
import SectionBody from '../../molecules/SectionBody/SectionBody'
import { getSectionLabel } from '../../../content/navigation'
import { codeExamples } from '../../../content/codeExamples'
import type { Framework, TestingType } from '../../../content/codeExamples'
import styles from './CodeSamples.module.css'

const sectionLabel = getSectionLabel('code-samples')

const testingTypeOptions: SegmentedControlOption<TestingType>[] = [
  { value: 'e2e', label: 'End-to-End', icon: <EndToEndIcon aria-hidden="true" /> },
  { value: 'component', label: 'Component', icon: <ComponentTestIcon aria-hidden="true" /> },
  {
    value: 'performance',
    label: 'Performance',
    icon: <PerformanceIcon aria-hidden="true" />,
    disabled: true,
  },
]

function CodeSamples() {
  const [testingType, setTestingType] = useState<SelectableTestingType>('e2e')
  const [framework, setFramework] = useState<Framework>('playwright')
  const [activeFileIndex, setActiveFileIndex] = useState(0)

  const example = codeExamples.find(
    (item) => item.testingType === testingType && item.framework === framework,
  )!
  const activeFile = example.files[activeFileIndex]

  const handleTestingTypeChange = (next: TestingType) => {
    // Performance is disabled/soon — Radix never fires a change for a
    // disabled radio item, but the type still has to account for it since
    // it's a real option in testingTypeOptions.
    if (next === 'performance') return

    setTestingType(next)
    // Component and e2e have disjoint framework sets — landing on the
    // previous tier's framework would pick an example that doesn't exist
    // for the new one, so always reset to the new tier's first (non-
    // disabled) framework.
    const firstFramework = frameworkOptionsByTestingType[next].find((option) => !option.disabled)!
    setFramework(firstFramework.value)
    setActiveFileIndex(0)
  }

  const handleFrameworkChange = (next: Framework) => {
    setFramework(next)
    // A different example can have fewer files than the current selection —
    // always land back on its first file rather than an out-of-range index.
    setActiveFileIndex(0)
  }

  return (
    <section id="code-samples" className="flush-section" aria-label={sectionLabel}>
      <ParticleBackground variant="code-samples" />
      <SectionBody gap={16}>
        <Card className={styles.explainer}>
          <Badge variant="outline-accent">All testing below is written directly against this portfolio/repo</Badge>
          <p>
            Pick a testing type, then a framework in the selector below to see sample test automation.
            End-to-End is ordered spec → page object → config to mirror my mental model from broad to narrow. Component runs the same assertions against the same components
            through both Vitest and Cypress.
            Performance testing is still on my roadmap.
          </p>
        </Card>

        <SegmentedControl
          value={testingType}
          onChange={handleTestingTypeChange}
          options={testingTypeOptions}
          ariaLabel="Testing type"
        />

        <FrameworkSwitcher testingType={testingType} value={framework} onChange={handleFrameworkChange} />

        <div className={styles.panel}>
          <CodeFileTabs
            files={example.files}
            activeIndex={activeFileIndex}
            onChange={setActiveFileIndex}
          />
          <PanelFooter filePath={activeFile.filename} />
        </div>
      </SectionBody>
    </section>
  )
}

export default CodeSamples
