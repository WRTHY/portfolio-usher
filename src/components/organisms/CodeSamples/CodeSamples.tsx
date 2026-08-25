import { useState } from 'react'
import FrameworkSwitcher from '../../molecules/FrameworkSwitcher/FrameworkSwitcher'
import { frameworkOptionsByTestingType } from '../../molecules/FrameworkSwitcher/frameworkOptions'
import type { SelectableTestingType } from '../../molecules/FrameworkSwitcher/frameworkOptions'
import SegmentedControl from '../../molecules/SegmentedControl/SegmentedControl'
import type { SegmentedControlOption } from '../../molecules/SegmentedControl/SegmentedControl'
import { ComponentTestIcon, EndToEndIcon, PerformanceIcon } from '../../atoms/icons/TestingTypeIcons'
import CodeFileTabs from '../../molecules/CodeFileTabs/CodeFileTabs'
import PanelFooter from '../../molecules/PanelFooter/PanelFooter'
import ParticleBackground from '../../molecules/ParticleBackground/ParticleBackground'
import { sections } from '../../../content/navigation'
import { codeExamples } from '../../../content/codeExamples'
import type { Framework, TestingType } from '../../../content/codeExamples'
import styles from './CodeSamples.module.css'

const sectionLabel = sections.find((section) => section.id === 'code-samples')!.label

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
    <section id="code-samples" aria-label={sectionLabel}>
      <ParticleBackground variant="code-samples" />
      {/* .body cancels the shared reading-column indent (same trick
          .hero-content uses) so the section's content sits flush at the
          section's own padding edge, matching Experience/CaseStudies. */}
      <div className={styles.body}>
        <div className={styles.explainer}>
          <span className={styles.kicker}>How to read this</span>
          <p>
            Pick a testing type, then a framework — the panel below shows real files straight from
            this repo. End-to-End is ordered spec → page object → config to mirror how the suite
            actually gets written; Component runs the same assertions against the same components
            through both Vitest and Cypress, so the framework choice is a real one there too.
            Performance is still on the roadmap.
          </p>
        </div>

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
      </div>
    </section>
  )
}

export default CodeSamples
