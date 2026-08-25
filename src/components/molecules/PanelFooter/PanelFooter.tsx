import RunButton from '../../atoms/RunButton/RunButton'
import styles from './PanelFooter.module.css'

type PanelFooterProps = {
  filePath: string
}

function PanelFooter({ filePath }: PanelFooterProps) {
  return (
    <div className={styles.footer}>
      <span className={styles.path} data-testid="active-file-path">
        {filePath}
      </span>
      <div className={styles.actions}>
        <span className={styles.pill}>Live demo — coming soon</span>
        <RunButton />
      </div>
    </div>
  )
}

export default PanelFooter
