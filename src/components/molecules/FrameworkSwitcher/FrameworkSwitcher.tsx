import * as Tabs from '@radix-ui/react-tabs'
import { SiCypress } from 'react-icons/si'
import type { AutomationExample } from '../../../content/codeExamples'
import styles from './FrameworkSwitcher.module.css'

type Framework = AutomationExample['framework']

type FrameworkSwitcherProps = {
  value: Framework
  onChange: (framework: Framework) => void
}

// react-icons' bundled Simple Icons set has no Playwright mark (checked
// against the installed version) — Cypress gets its real logo, Playwright
// stays text-only rather than fake a brand icon.
function FrameworkSwitcher({ value, onChange }: FrameworkSwitcherProps) {
  return (
    <Tabs.Root
      value={value}
      onValueChange={(next) => onChange(next as Framework)}
      className={styles.switcher}
      aria-label="Automation framework"
    >
      <RadioGroup.Item value="playwright" className={styles.trigger}>
        Playwright
      </RadioGroup.Item>
      <RadioGroup.Item value="cypress" className={styles.trigger}>
        <SiCypress aria-hidden="true" />
        Cypress
      </RadioGroup.Item>
    </RadioGroup.Root>
  )
}

export default FrameworkSwitcher
