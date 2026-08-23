import SegmentedControl from '../SegmentedControl/SegmentedControl'
import { frameworkOptionsByTestingType } from './frameworkOptions'
import type { SelectableTestingType } from './frameworkOptions'
import type { Framework } from '../../../content/codeExamples'

type FrameworkSwitcherProps = {
  testingType: SelectableTestingType
  value: Framework
  onChange: (framework: Framework) => void
}

function FrameworkSwitcher({ testingType, value, onChange }: FrameworkSwitcherProps) {
  return (
    <SegmentedControl
      value={value}
      onChange={onChange}
      options={frameworkOptionsByTestingType[testingType]}
      ariaLabel="Automation framework"
    />
  )
}

export default FrameworkSwitcher
