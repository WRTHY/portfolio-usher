// Content for the "API Testing" section: a static counterpart to
// codeExamples.ts (no live playback, just a toggle between two frozen
// snippets), pointing at a separate repo (see links.apiTestingRepo) that
// exercises reqres.in with both Postman and Playwright's `request` fixture.
//
// `apiTestingExamples` is generated, not hand-written; see
// apiTesting.generated.ts. To add, remove, or retitle an example, edit
// apiTestingManifest.json and run `npm run fetch:api-testing`.

// The one line shown when the API suite's project is opened.
export const apiTestingIntro = `reqres.in is a free, hosted fake REST API that returns realistic (if canned) JSON for common resources like users built for practicing API testing against something real without needing a backend of your own.`

export type ApiTestingSnippet = {
  filename: string
  language: 'typescript' | 'javascript'
  code: string
}

export type ApiTestingExample = {
  id: string
  tag: string
  title: string
  description: string
  playwright: ApiTestingSnippet
  postman: ApiTestingSnippet
}

export { apiTestingExamples } from './apiTesting.generated'
