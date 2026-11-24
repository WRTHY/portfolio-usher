import { readFile } from 'node:fs/promises'
import type { Plugin } from 'vite'
import { highlightCode, languageOf } from './highlight.ts'

const QUERY = '?highlight'

// `import file from './x.ts?highlight'` gives { code, html }: the file's own
// text (line endings normalised) and its highlighted markup, both read from
// the real file at build time, so the two can't disagree.
export function highlightedFiles(): Plugin {
  return {
    name: 'highlighted-files',
    async load(id) {
      if (!id.endsWith(QUERY)) return null
      const file = id.slice(0, -QUERY.length)
      this.addWatchFile(file)
      const code = (await readFile(file, 'utf-8')).replace(/\r\n/g, '\n')
      const html = await highlightCode(code, languageOf(file))
      return `export default ${JSON.stringify({ code, html })}`
    },
  }
}
