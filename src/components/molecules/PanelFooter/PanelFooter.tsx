import styles from './PanelFooter.module.css'

type PanelFooterProps = {
  filePath: string
  /** A short note on the right, e.g. which CI workflow runs the file. */
  note?: string
}

// The code panel's last line: where the file on screen lives.
function PanelFooter({ filePath, note }: PanelFooterProps) {
  return (
    <div className={styles.footer}>
      <span className={styles.path} data-testid="active-file-path">
        {filePath}
      </span>
      {note && (
        <span className={styles.note} data-testid="active-file-note">
          {note}
        </span>
      )}
    </div>
  )
}

export default PanelFooter
