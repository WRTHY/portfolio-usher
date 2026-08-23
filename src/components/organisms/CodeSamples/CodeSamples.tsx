import { useState } from 'react'
import type { CSSProperties } from 'react'
import FrameworkSwitcher from '../../molecules/FrameworkSwitcher/FrameworkSwitcher'
import { frameworkOptionsByTestingType } from '../../molecules/FrameworkSwitcher/frameworkOptions'
import type { SelectableTestingType } from '../../molecules/FrameworkSwitcher/frameworkOptions'
import SegmentedControl from '../../molecules/SegmentedControl/SegmentedControl'
import type { SegmentedControlOption } from '../../molecules/SegmentedControl/SegmentedControl'
import CodeFileTabs from '../../molecules/CodeFileTabs/CodeFileTabs'
import PanelFooter from '../../molecules/PanelFooter/PanelFooter'
import ParticleBackground from '../../molecules/ParticleBackground/ParticleBackground'
import { sections } from '../../../content/navigation'
import { codeExamples } from '../../../content/codeExamples'
import type { Framework, TestingType } from '../../../content/codeExamples'
import styles from './CodeSamples.module.css'

const sectionLabel = sections.find((section) => section.id === 'code-samples')!.label

const testingTypeOptions: SegmentedControlOption<TestingType>[] = [
  { value: 'component', label: 'Component' },
  { value: 'e2e', label: 'End-to-End' },
  { value: 'performance', label: 'Performance', disabled: true },
]

function CodeSamples() {
  const [testingType, setTestingType] = useState<SelectableTestingType>('e2e')
  const [framework, setFramework] = useState<Framework>('playwright')
  const [activeFileIndex, setActiveFileIndex] = useState(0)

  const example = codeExamples.find(
    (item) => item.testingType === testingType && item.framework === framework,
  )!
  const activeFile = example.files[activeFileIndex]
  // Reserves enough vertical room for the tallest file *within the current
  // example*, so swapping between its own files never resizes the panel.
  // Scoped to the example rather than every example site-wide — the
  // Component tier's spec is much longer than the E2E ones, and reserving
  // for that globally left short examples with a large blank gap at the
  // bottom of the code panel.
  const maxCodeLines = Math.max(...example.files.map((file) => file.code.split('\n').length))

  const handleTestingTypeChange = (next: TestingType) => {
    // Performance is disabled/soon — Radix never fires a change for a
    // disabled radio item, but the type still has to account for it since
    // it's a real option in testingTypeOptions.
    if (next === 'performance') return

    setTestingType(next)
    // Cypress CT/Playwright CT and Playwright/Cypress are disjoint option
    // sets per tier — landing on the previous tier's framework would pick
    // an example that doesn't exist for the new one, so always reset to
    // the new tier's first (non-disabled) framework.
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
            Pick a testing type, then a framework — the panel below swaps to a real example for
            each pairing. End-to-End specs mirror ones that exist in this repo today; Component
            previews a newer tier, testing the copy button on this page directly, ahead of a
            matching spec file landing in the suite. Performance is still on the roadmap.
          </p>
        </div>

        <SegmentedControl
          value={testingType}
          onChange={handleTestingTypeChange}
          options={testingTypeOptions}
          ariaLabel="Testing type"
        />

        <FrameworkSwitcher testingType={testingType} value={framework} onChange={handleFrameworkChange} />

        <div className={styles.panel} style={{ '--code-lines': maxCodeLines } as CSSProperties}>
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
