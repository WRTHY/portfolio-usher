import Badge from '../../atoms/Badge/Badge'
import { skillColorway } from '../SkillsAndTools/skillColorway'

type SkillBadgeProps = {
  label: string
}

// A Badge colored by the label's Skills & Tools category. Labels that
// aren't a known tool (e.g. "Leadership") fall back to the accent Badge.
function SkillBadge({ label }: SkillBadgeProps) {
  return <Badge colorway={skillColorway(label)}>{label}</Badge>
}

export default SkillBadge
