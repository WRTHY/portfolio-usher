import { toolCategories } from './toolCategories'
import styles from './SkillsAndTools.module.css'

// Icon-only by design — the tool name only appears on hover (see
// .hoverLabel), so each name is duplicated into visually-hidden text that's
// always in the accessible tree. The icon itself is aria-hidden since it's
// decorative once that text carries the name.
//
// No per-category wrapper card — each category's <ul> is display: contents
// (see SkillsAndTools.module.css), so its <li> chips become direct items of
// the single shared .grid below and waterfall together across the card's
// full width instead of being boxed into three separately-wrapped columns.
// The <ul>/aria-label still groups each category for screen readers even
// though it no longer draws a visible boundary.
function SkillsAndTools() {
  return (
    <div className={styles.grid}>
      {toolCategories.map((category) => (
        <ul key={category.id} className={styles.categoryList} aria-label={category.ariaLabel}>
          {category.tools.map((tool) => (
            <li key={tool.name}>
              <span className={`${styles.chip} ${styles[category.colorway]}`}>
                <span className={styles.iconWrap} aria-hidden="true">
                  {tool.icon}
                </span>
                <span className={styles.hoverLabel} aria-hidden="true">
                  {tool.name}
                </span>
                <span className={styles.srOnly}>{tool.name}</span>
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  )
}

export default SkillsAndTools
