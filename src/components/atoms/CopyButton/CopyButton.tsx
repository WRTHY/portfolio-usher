import { useState } from 'react'
import { FaCheck, FaRegCopy } from 'react-icons/fa6'
import IconButton from '../IconButton/IconButton'

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
    <IconButton onClick={handleClick} ariaLabel={copied ? 'Copied' : 'Copy code'} size={14}>
      {copied ? <FaCheck /> : <FaRegCopy />}
    </IconButton>
  )
}

export default CopyButton
