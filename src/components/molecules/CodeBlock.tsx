import ShikiHighlighter from 'react-shiki'

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
      className="code-block"
    >
      {code}
    </ShikiHighlighter>
  )
}

export default CodeBlock
