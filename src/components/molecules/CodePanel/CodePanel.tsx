import { useState } from 'react'
import type { ReactNode } from 'react'
import { SiCypress, SiGithubactions, SiPostman } from 'react-icons/si'
import type { AutomationExample, Framework } from '../../../content/codeExamples'
import CodeFileTabs from '../CodeFileTabs/CodeFileTabs'
import PanelFooter from '../PanelFooter/PanelFooter'
import SegmentedControl from '../SegmentedControl/SegmentedControl'
import type { SegmentedControlOption } from '../SegmentedControl/SegmentedControl'
import { cx } from '../../../utils/classNames'
import styles from './CodePanel.module.css'

// react-icons has no Playwright or Vitest mark, so those stay text-only
// rather than fake a brand icon.
const frameworks: Record<Framework, { label: string; icon?: ReactNode }> = {
  'github-actions': { label: 'GitHub Actions', icon: <SiGithubactions aria-hidden="true" /> },
  playwright: { label: 'Playwright' },
  cypress: { label: 'Cypress', icon: <SiCypress aria-hidden="true" /> },
  vitest: { label: 'Vitest' },
  postman: { label: 'Postman', icon: <SiPostman aria-hidden="true" /> },
}

type CodePanelProps = {
  /** The examples it shows. More than one adds a switch between their frameworks. */
  examples: readonly AutomationExample[]
  /** Names that switch, e.g. "End-to-end framework". */
  frameworkLabel: string
  /** A note under the code, e.g. which CI workflow runs it. */
  note?: string
  className?: string
}

// The code itself: a page-coloured panel with, when there's a choice, a
// switch between frameworks, then the files' tabs, the code, and the path.
// A host that swaps its examples should key it, so it starts fresh on the
// first framework and the first file.
function CodePanel({ examples, frameworkLabel, note, className }: CodePanelProps) {
  const [framework, setFramework] = useState<Framework>(examples[0].framework)
  const [fileIndex, setFileIndex] = useState(0)

  const example = examples.find((item) => item.framework === framework) ?? examples[0]
  const file = example.files[fileIndex] ?? example.files[0]

  const options: SegmentedControlOption<Framework>[] = examples.map((item) => ({
    value: item.framework,
    ...frameworks[item.framework],
  }))

  const chooseFramework = (next: Framework) => {
    setFramework(next)
    // Another framework's example can have fewer files.
    setFileIndex(0)
  }

  return (
    <div className={cx(styles.panel, className)}>
      {examples.length > 1 && (
        <SegmentedControl value={framework} onChange={chooseFramework} options={options} ariaLabel={frameworkLabel} />
      )}
      <div className={styles.code}>
        <CodeFileTabs files={example.files} activeIndex={fileIndex} onChange={setFileIndex} />
        <PanelFooter filePath={file.filename} note={note} />
      </div>
    </div>
  )
}

export default CodePanel
