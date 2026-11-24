// Syntax highlighting, done once at build time so the browser ships no
// highlighter at all. Shared by the Vite plugin (the repo's own files) and
// fetch-api-testing-examples.mjs (the API suite's snippets); both hand the
// finished HTML to CodeBlock.
import { createHighlighter } from 'shiki'
import type { Highlighter, ShikiTransformer } from 'shiki'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import { oneDarkContrastFixes, oneLightContrastFixes } from '../src/styles/syntaxPalette.ts'

export type CodeLanguage = 'typescript' | 'javascript' | 'yaml'

const languageByExtension: Record<string, CodeLanguage> = {
  ts: 'typescript',
  tsx: 'typescript',
  js: 'javascript',
  mjs: 'javascript',
  yml: 'yaml',
  yaml: 'yaml',
}

export function languageOf(filename: string): CodeLanguage {
  const language = languageByExtension[filename.split('.').pop() ?? '']
  if (!language) throw new Error(`No highlighting language for ${filename}`)
  return language
}

// Line numbers are a CSS counter on each line (see CodeBlock.module.css),
// so the markup only has to mark the lines.
const lineNumbers: ShikiTransformer = {
  code(node) {
    this.addClassToHast(node, 'has-line-numbers')
  },
  line(node) {
    this.addClassToHast(node, 'numbered-line')
  },
}

let highlighter: Promise<Highlighter> | undefined

const getHighlighter = () =>
  (highlighter ??= createHighlighter({
    themes: ['one-light', 'one-dark-pro'],
    langs: ['typescript', 'javascript', 'yaml'],
    engine: createJavaScriptRegexEngine(),
  }))

// Paired light/dark themes + defaultColor 'light-dark()' make Shiki emit a
// light-dark() colour per token, so the code follows the site's colour
// scheme. The contrast fixes live in the shared syntax palette, which the
// Skills & Tools category colours also derive from.
export async function highlightCode(code: string, language: CodeLanguage): Promise<string> {
  const shiki = await getHighlighter()
  const html = shiki.codeToHtml(code, {
    lang: language,
    themes: { light: 'one-light', dark: 'one-dark-pro' },
    defaultColor: 'light-dark()',
    colorReplacements: {
      'one-light': oneLightContrastFixes,
      'one-dark-pro': oneDarkContrastFixes,
    },
    transformers: [lineNumbers],
  })

  // Shiki repeats every colour as --shiki-light / --shiki-dark variables
  // beside the light-dark() one. Nothing reads them, and with a span per
  // token they were most of the markup.
  return html.replace(/;--shiki-[a-z-]+:[^;"]+/g, '').replace(/light-dark\(([^,)]+), /g, 'light-dark($1,')
}
