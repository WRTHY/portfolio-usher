import * as Tabs from '@radix-ui/react-tabs'
import { SiTypescript } from 'react-icons/si'
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
        <div className={styles.left}>
          {/* Only one language exists today, so this is a static badge, not
              a selector — LanguageTabs was removed for the same reason.
              Promote it back into a real selector when a second language
              ships. */}
          <span className={styles.languageBadge}>
            <SiTypescript aria-hidden="true" />
            TypeScript
          </span>
          <span className={styles.divider} aria-hidden="true" />
          <Tabs.List className={styles.list} aria-label="Files in this example">
            {files.map((file, index) => (
              <Tabs.Trigger key={file.filename} value={String(index)} className={styles.trigger}>
                <span className={styles.dot} aria-hidden="true" />
                {file.filename.split('/').pop()}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </div>
        <CopyButton text={activeFile.code} />
      </div>

      {/* forceMount + CSS visibility (rather than Radix's default
          unmount-on-inactive) keeps every file's highlighted output in the
          DOM once rendered, so re-visiting a file is an instant style swap
          instead of re-running Shiki's async highlight and re-triggering
          the loading gap. */}
      {files.map((file, index) => (
        <Tabs.Content
          key={file.filename}
          value={String(index)}
          forceMount
          className={styles.codeArea}
        >
          <CodeBlock code={file.code} language={file.language} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

export default CodeFileTabs
