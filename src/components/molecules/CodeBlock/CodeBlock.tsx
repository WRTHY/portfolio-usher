import ShikiHighlighter from 'react-shiki'
import styles from './CodeBlock.module.css'

type CodeBlockProps = {
  code: string
  language: string
}

function CodeBlock({ code, language }: CodeBlockProps) {
  return (
    <ShikiHighlighter
      language={language}
      theme="one-dark-pro"
      engine="javascript"
      showLineNumbers
      showLanguage={false}
      addDefaultStyles={false}
      className={styles.codeBlock}
    >
      {code}
    </ShikiHighlighter>
  )
}

export default CodeBlock
