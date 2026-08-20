import * as RadioGroup from '@radix-ui/react-radio-group'
import { SiOpenjdk, SiPython, SiTypescript } from 'react-icons/si'
import SoonBadge from '../../atoms/SoonBadge/SoonBadge'
import styles from './LanguageTabs.module.css'

export type Language = 'typescript' | 'python' | 'java'

type LanguageTabsProps = {
  value: Language
  onChange: (language: Language) => void
}

// A RadioGroup rather than Tabs, for the same reason as FrameworkSwitcher:
// this picks a value, it doesn't own a tabpanel, so Radix's Tabs.Trigger
// would emit an aria-controls pointing nowhere.
function LanguageTabs({ value, onChange }: LanguageTabsProps) {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={(next) => onChange(next as Language)}
      className={styles.tabs}
      aria-label="Code language"
    >
      <RadioGroup.Item value="typescript" className={styles.trigger}>
        <SiTypescript aria-hidden="true" />
        TypeScript
      </RadioGroup.Item>
      <RadioGroup.Item value="python" className={styles.trigger} disabled>
        <SiPython aria-hidden="true" />
        Python
        <SoonBadge />
      </RadioGroup.Item>
      <RadioGroup.Item value="java" className={styles.trigger} disabled>
        <SiOpenjdk aria-hidden="true" />
        Java
        <SoonBadge />
      </RadioGroup.Item>
    </RadioGroup.Root>
  )
}

export default LanguageTabs
