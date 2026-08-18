import * as Tabs from '@radix-ui/react-tabs'
import { SiOpenjdk, SiPython, SiTypescript } from 'react-icons/si'
import SoonBadge from '../atoms/SoonBadge'

export type Language = 'typescript' | 'python' | 'java'

type LanguageTabsProps = {
  value: Language
  onChange: (language: Language) => void
}

function LanguageTabs({ value, onChange }: LanguageTabsProps) {
  return (
    <Tabs.Root
      value={value}
      onValueChange={(next) => onChange(next as Language)}
      className="language-tabs"
    >
      <Tabs.List className="language-tabs-list" aria-label="Code language">
        <Tabs.Trigger value="typescript" className="language-tabs-trigger">
          <SiTypescript aria-hidden="true" />
          TypeScript
        </Tabs.Trigger>
        <Tabs.Trigger value="python" className="language-tabs-trigger" disabled>
          <SiPython aria-hidden="true" />
          Python
          <SoonBadge />
        </Tabs.Trigger>
        <Tabs.Trigger value="java" className="language-tabs-trigger" disabled>
          <SiOpenjdk aria-hidden="true" />
          Java
          <SoonBadge />
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}

export default LanguageTabs
