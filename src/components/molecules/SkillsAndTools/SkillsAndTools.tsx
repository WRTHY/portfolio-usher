import { useId } from 'react'
import { skillChipVars } from '../../../styles/syntaxPalette'
import { toolCategories } from './toolCategories'
import styles from './SkillsAndTools.module.css'

// A quick reference: every tool as a small icon tile, grouped by category.
// Hovering a tile previews its name above it; screen readers get the name
// from visually-hidden text, and touch screens show it under the icon.
function SkillsAndTools() {
  const baseId = useId()

  return (
    <div className={styles.groups}>
      {toolCategories.map((category) => {
        const labelId = `${baseId}-${category.id}`
        return (
          <div key={category.id} className={styles.group}>
            <p id={labelId} className={styles.groupLabel}>
              {category.ariaLabel}
            </p>
            <ul className={styles.tiles} aria-labelledby={labelId}>
              {category.tools.map((tool) => (
                <li key={tool.name} className={styles.tile} style={skillChipVars(category.colorway)}>
                  <span className={styles.icon} aria-hidden="true">
                    {tool.icon}
                  </span>
                  <span className={styles.preview} aria-hidden="true">
                    {tool.name}
                  </span>
                  <span className={styles.srOnly}>{tool.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default SkillsAndTools
