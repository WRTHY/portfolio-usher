import * as Tabs from '@radix-ui/react-tabs'
import CopyButton from '../../atoms/CopyButton/CopyButton'
import CodeBlock from '../CodeBlock/CodeBlock'
import type { CodeFile } from '../../../content/codeExamples'
import styles from './CodeFileTabs.module.css'

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
      className={styles.panel}
    >
      <div className={styles.row}>
        <Tabs.List className={styles.list} aria-label="Files in this example">
          {files.map((file, index) => (
            <Tabs.Trigger key={file.filename} value={String(index)} className={styles.trigger}>
              <span className={styles.dot} aria-hidden="true" />
              {file.filename.split('/').pop()}
            </Tabs.Trigger>
          ))}
        </Tabs.List>
        <CopyButton text={activeFile.code} />
      </div>

      {files.map((file, index) => (
        <Tabs.Content key={file.filename} value={String(index)} className={styles.codeArea}>
          <CodeBlock code={file.code} language={file.language} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

export default CodeFileTabs
