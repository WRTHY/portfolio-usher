import { Fragment } from 'react'
import * as RadioGroup from '@radix-ui/react-radio-group'
import { FaCodePullRequest } from 'react-icons/fa6'
import type { PipelineChoice, PipelineStart, PipelineTier, StageId } from '../../../content/pipeline'
import styles from './PipelineStages.module.css'

type PipelineStagesProps = {
  /** A short line above the diagram. */
  label: string
  start: PipelineStart
  tiers: readonly PipelineTier[]
  /** Each stage's test count, by stage id; stages without one show none. */
  counts: Partial<Record<StageId, number>>
  value: PipelineChoice
  onChange: (choice: PipelineChoice) => void
}

const Arrow = () => (
  <span className={styles.arrow} aria-hidden="true">
    <svg viewBox="0 0 24 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M1 6h21M17 1.5 22 6l-5 4.5" />
    </svg>
  </span>
)

// The site's CI, drawn as a micrographic under a short label: the pipeline
// file that starts every run, then its tiers in the order they run, with an
// arrow from each to the next (left to right, or top to bottom on a phone).
// Stages in a tier sit side by side: they run in parallel. It's also how the
// code below is browsed: each node is a choice that shows its code, the
// pipeline file or a stage's tests.
function PipelineStages({ label, start, tiers, counts, value, onChange }: PipelineStagesProps) {
  return (
    <div className={styles.pipeline}>
      <p className={styles.label}>
        <FaCodePullRequest aria-hidden="true" />
        {label}
      </p>
      <RadioGroup.Root
        value={value}
        onValueChange={(next) => onChange(next as PipelineChoice)}
        className={styles.tiers}
        aria-label="Test stage"
      >
        <div className={styles.tier} data-testid="pipeline-start">
          <p className={styles.tierLabel}>{start.label}</p>
          <div className={styles.tierStages}>
            <RadioGroup.Item value="pipeline" className={styles.stage} data-testid="pipeline-stage-pipeline">
              <span className={`${styles.name} ${styles.file}`}>{start.name}</span>
              <span className={styles.tools}>{start.tools}</span>
            </RadioGroup.Item>
          </div>
        </div>
        {tiers.map((tier) => (
          <Fragment key={tier.number}>
            <Arrow />
            <div className={styles.tier} data-testid={`pipeline-tier-${tier.number}`}>
              <p className={styles.tierLabel}>
                <span className={styles.tierNumber}>{tier.number}</span>
                {tier.name}
              </p>
              <div className={styles.tierStages}>
                {tier.stages.map((stage) => {
                  const count = counts[stage.id]
                  return (
                    <RadioGroup.Item
                      key={stage.id}
                      value={stage.id}
                      className={styles.stage}
                      data-testid={`pipeline-stage-${stage.id}`}
                    >
                      <span className={styles.name}>{stage.name}</span>
                      <span className={styles.tools}>{stage.tools}</span>
                      {count !== undefined && <span className={styles.tools}>{count} tests</span>}
                    </RadioGroup.Item>
                  )
                })}
              </div>
            </div>
          </Fragment>
        ))}
      </RadioGroup.Root>
    </div>
  )
}

export default PipelineStages
