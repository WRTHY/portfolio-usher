import { useState } from 'react'
import SectionWatermark from '../../atoms/SectionWatermark/SectionWatermark'
import FrameworkSwitcher from '../../molecules/FrameworkSwitcher/FrameworkSwitcher'
import LanguageTabs from '../../molecules/LanguageTabs/LanguageTabs'
import type { Language } from '../../molecules/LanguageTabs/LanguageTabs'
import CodeFileTabs from '../../molecules/CodeFileTabs/CodeFileTabs'
import PanelFooter from '../../molecules/PanelFooter/PanelFooter'
import { sections } from '../../../content/navigation'
import { codeExamples } from '../../../content/codeExamples'
import type { AutomationExample } from '../../../content/codeExamples'
import styles from './CodeSamples.module.css'

const watermarkText = sections.find((section) => section.id === 'code-samples')!.label

type Framework = AutomationExample['framework']

function CodeSamples() {
  const [framework, setFramework] = useState<Framework>('playwright')
  const [language, setLanguage] = useState<Language>('typescript')
  const [activeFileIndex, setActiveFileIndex] = useState(0)

  const example = codeExamples.find((item) => item.framework === framework)!
  const activeFile = example.files[activeFileIndex]

  const handleFrameworkChange = (next: Framework) => {
    setFramework(next)
    // A different example can have fewer files than the current selection —
    // always land back on its first file rather than an out-of-range index.
    setActiveFileIndex(0)
  }

  return (
    <section id="code-samples" aria-label={watermarkText}>
      <SectionWatermark text={watermarkText} />

      <div className={styles.body}>
        <FrameworkSwitcher value={framework} onChange={handleFrameworkChange} />

        <div className={styles.main}>
          <div className={styles.languageRow}>
            <LanguageTabs value={language} onChange={setLanguage} />
          </div>

          <div className={styles.panel}>
            <CodeFileTabs
              files={example.files}
              activeIndex={activeFileIndex}
              onChange={setActiveFileIndex}
            />
            <PanelFooter filePath={activeFile.filename} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CodeSamples
