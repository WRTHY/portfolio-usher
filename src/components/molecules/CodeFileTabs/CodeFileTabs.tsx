import * as Tabs from '@radix-ui/react-tabs'
import { SiJavascript, SiTypescript, SiYaml } from 'react-icons/si'
import CopyButton from '../../atoms/CopyButton/CopyButton'
import CodeBlock from '../CodeBlock/CodeBlock'
import type { CodeFile, CodeLanguage } from '../../../content/codeExamples'
import styles from './CodeFileTabs.module.css'

type CodeFileTabsProps = {
  files: CodeFile[]
  activeIndex: number
  onChange: (index: number) => void
}

const languages: Record<CodeLanguage, { name: string; icon: React.ReactNode }> = {
  typescript: { name: 'TypeScript', icon: <SiTypescript aria-hidden="true" /> },
  javascript: { name: 'JavaScript', icon: <SiJavascript aria-hidden="true" /> },
  yaml: { name: 'YAML', icon: <SiYaml aria-hidden="true" /> },
}

// A file's tab: its label when it has one (two files can share a name, like
// the API examples' pairs), otherwise the file's own name.
const tabName = (file: CodeFile) => file.label ?? file.filename.split('/').pop()!

function CodeFileTabs({ files, activeIndex, onChange }: CodeFileTabsProps) {
  const activeFile = files[activeIndex]
  const language = languages[activeFile.language]

  return (
    <Tabs.Root
      value={String(activeIndex)}
      onValueChange={(next) => onChange(Number(next))}
      className={styles.panel}
    >
      <div className={styles.row}>
        <div className={styles.left}>
          {/* The active file's language: a static badge, not a selector. */}
          <span className={styles.languageBadge}>
            {language.icon}
            {language.name}
          </span>
          <span className={styles.divider} aria-hidden="true" />
          <Tabs.List className={styles.list} aria-label="Files in this example">
            {files.map((file, index) => (
              <Tabs.Trigger
                key={index}
                value={String(index)}
                className={styles.trigger}
                data-testid={`file-tab-${tabName(file)}`}
              >
                <span className={styles.dot} aria-hidden="true" />
                {tabName(file)}
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
          key={index}
          value={String(index)}
          forceMount
          className={styles.codeArea}
          // Only the active panel gets the testid - every file is
          // force-mounted simultaneously (see comment above), so this is
          // what lets e2e tests find "the visible code" unambiguously
          // instead of matching every mounted-but-hidden panel too.
          data-testid={index === activeIndex ? 'active-code-panel' : undefined}
        >
          {file.note && <p className={styles.note}>{file.note}</p>}
          <CodeBlock code={file.code} language={file.language} />
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}

export default CodeFileTabs
