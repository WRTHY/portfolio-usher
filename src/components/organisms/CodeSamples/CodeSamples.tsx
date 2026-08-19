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

      {/* .code-samples-body cancels the shared reading-column indent (same
          trick .hero-content uses) so the switcher can sit flush at the
          section's own padding edge — out in the page's margin — and,
          on wider screens, vertically centered beside the panel rather
          than stacked above it. */}
      <div className="code-samples-body">
        <FrameworkSwitcher value={framework} onChange={handleFrameworkChange} />

        <div className="code-samples-main">
          <div className="code-samples-language-row">
            <LanguageTabs value={language} onChange={setLanguage} />
          </div>

          <div className="code-panel">
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
