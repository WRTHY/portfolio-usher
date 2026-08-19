import * as Tabs from '@radix-ui/react-tabs'
import CopyButton from '../atoms/CopyButton'
import CodeBlock from './CodeBlock'
import type { CodeFile } from '../../content/codeExamples'

type CodeFileTabsProps = {
  files: CodeFile[]
  activeIndex: number
  onChange: (index: number) => void
}

function CodeFileTabs({ files, activeIndex, onChange }: CodeFileTabsProps) {
  const activeFile = files[activeIndex]

  return (
    <Tabs.Root
      value={String(activeIndex)}
      onValueChange={(next) => onChange(Number(next))}
      className="file-tabs-panel"
    >
      <div className="file-tabs-row">
        <Tabs.List className="file-tabs-list" aria-label="Files in this example">
          {files.map((file, index) => (
            <Tabs.Trigger key={file.filename} value={String(index)} className="file-tabs-trigger">
              <span className="file-tabs-dot" aria-hidden="true" />
              {file.filename.split('/').pop()}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <CopyButton text={activeFile.code} />
      </div>

      {files.map((file, index) => (
        <Tabs.Content key={file.filename} value={String(index)} className="code-area">
          <CodeBlock code={file.code} language={file.language} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

export default CodeFileTabs
