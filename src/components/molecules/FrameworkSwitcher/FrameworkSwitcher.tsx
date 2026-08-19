import * as RadioGroup from '@radix-ui/react-radio-group'
import { SiCypress } from 'react-icons/si'
import type { AutomationExample } from '../../../content/codeExamples'

type Framework = AutomationExample['framework']

type FrameworkSwitcherProps = {
  value: Framework
  onChange: (framework: Framework) => void
}

// react-icons' bundled Simple Icons set has no Playwright mark (checked
// against the installed version) — Cypress gets its real logo, Playwright
// stays text-only rather than fake a brand icon.
//
// This is a RadioGroup, not Tabs: it picks a value, it doesn't reveal an
// associated tabpanel (the actual code panel lives in CodeFileTabs). Radix's
// Tabs.Trigger always emits aria-controls pointing at a Tabs.Content, so
// using Tabs here left aria-controls referencing an id that never existed —
// an axe "aria-valid-attr-value" violation caught by the a11y test suite.
function FrameworkSwitcher({ value, onChange }: FrameworkSwitcherProps) {
  return (
    <RadioGroup.Root
      value={value}
      onValueChange={(next) => onChange(next as Framework)}
      className="framework-switcher"
      aria-label="Automation framework"
    >
      <RadioGroup.Item value="playwright" className="framework-switcher-trigger">
        Playwright
      </RadioGroup.Item>
      <RadioGroup.Item value="cypress" className="framework-switcher-trigger">
        <SiCypress aria-hidden="true" />
        Cypress
      </RadioGroup.Item>
    </RadioGroup.Root>
  )
}

export default FrameworkSwitcher
