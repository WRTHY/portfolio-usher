import styles from './RunButton.module.css'

function RunButton() {
  return (
    <button type="button" className={styles.button} disabled aria-disabled="true">
      ▶ Run against this page
    </button>
  )
}

export default RunButton
