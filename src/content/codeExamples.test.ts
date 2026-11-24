import { describe, expect, it } from 'vitest'
import { codeExamples } from './codeExamples'

// Every file the panel could show, loaded by its real path in the repo.
const onDisk = import.meta.glob<string>(
  [
    '/e2e/**/*.ts',
    '/src/components/**/*.{test,cy}.tsx',
    '/src/test/setup.ts',
    '/cypress/support/*.ts',
    '/*.config.ts',
    '/eslint.config.js',
    '/.github/workflows/*.yml',
  ],
  { query: '?raw', import: 'default', eager: true },
)

const repoFiles = codeExamples
  .filter((example) => example.testingType !== 'api')
  .flatMap((example) => example.files.map((file) => [file.filename, file] as const))

// The Projects panel claims to show this repo's real test files. These hold
// it to that: each file it shows must be the file at the path it names,
// exactly, so a wrong import or a stale copy fails here.
describe('code examples', () => {
  it.each(repoFiles)('%s is the real file, verbatim', (filename, file) => {
    const real = onDisk[`/${filename}`]
    expect(real, `no file at ${filename}`).toBeDefined()
    expect(file.code).toBe(real.replace(/\r\n/g, '\n'))
  })

  it('every example has at least one file, with no two tabs named alike', () => {
    codeExamples.forEach((example) => {
      expect(example.files.length).toBeGreaterThan(0)
      const tabs = example.files.map((file) => file.label ?? file.filename.split('/').pop())
      expect(new Set(tabs).size).toBe(tabs.length)
    })
  })
})
