import * as Tabs from '@radix-ui/react-tabs'
import { SiCypress } from 'react-icons/si'
import type { AutomationExample } from '../../content/codeExamples'

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
      className="framework-switcher"
    >
      <Tabs.List className="framework-switcher-list" aria-label="Automation framework">
        <Tabs.Trigger value="playwright" className="framework-switcher-trigger">
          Playwright
        </Tabs.Trigger>
        <Tabs.Trigger value="cypress" className="framework-switcher-trigger">
          <SiCypress aria-hidden="true" />
          Cypress
        </Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  )
}

export default FrameworkSwitcher
