import { cx } from '../../../utils/classNames'
import styles from './CareerGraph.module.css'

export type CareerGraphNode = {
  id: string
  /** Vertical position of the node's centre, in px from the graph's top. */
  y: number
  active: boolean
  /** Its ledger row is hovered or focused: the node rings up to answer. */
  highlighted?: boolean
}

type CareerGraphProps = {
  /** Newest first, top to bottom, the same order as the ledger rows. */
  nodes: readonly CareerGraphNode[]
  height: number
  className?: string
}

const GRAPH_WIDTH = 12
const LINE_X = 6
const NODE_R = 4.5

// The Experience section's git-graph rail: one node per role on a single
// line, read like `git log --graph`. Decorative: the ledger rows carry all
// the same information as text.
function CareerGraph({ nodes, height, className }: CareerGraphProps) {
  if (nodes.length === 0) return null

  const first = nodes[0]
  const last = nodes[nodes.length - 1]

  return (
    <svg
      className={cx(styles.graph, className)}
      width={GRAPH_WIDTH}
      height={height}
      viewBox={`0 0 ${GRAPH_WIDTH} ${height}`}
      aria-hidden="true"
      data-testid="career-graph"
    >
      <line x1={LINE_X} y1={first.y} x2={LINE_X} y2={last.y} className={styles.line} />
      {nodes.map((node) => (
        <circle
          key={node.id}
          cx={LINE_X}
          cy={node.y}
          r={NODE_R}
          className={cx(styles.node, node.active && styles.active, node.highlighted && styles.highlighted)}
          data-node={node.id}
          data-active={node.active || undefined}
          data-highlighted={node.highlighted || undefined}
        />
      ))}
    </svg>
  )
}

export default CareerGraph
