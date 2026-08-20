import { useState } from 'react'
import { FaCheck, FaRegCopy } from 'react-icons/fa6'
import styles from './CopyButton.module.css'

type CopyButtonProps = {
  text: string
}

function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleClick = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={handleClick}
      aria-label={copied ? 'Copied' : 'Copy code'}
    >
      {copied ? <FaCheck /> : <FaRegCopy />}
    </button>
  )
}

export default CopyButton
