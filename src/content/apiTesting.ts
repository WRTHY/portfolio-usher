// Content for the "API Testing" section — a deliberately static counterpart
// to codeExamples.ts (no framework switcher, no live playback). It points at
// a separate repo (see links.apiTestingRepo) that exercises reqres.in, a
// free hosted fake REST API, with Playwright's `request` fixture.
//
// `apiTestingExamples` itself is generated, not hand-written — see
// apiTesting.generated.ts. To add, remove, or retitle an example, edit
// apiTestingManifest.json and run `npm run fetch:api-testing`, which pulls
// the real file straight from that repo rather than trusting a hand-copied
// paste to stay in sync.

export const apiTestingIntro = {
  paragraphs: [
    `reqres.in is a free, hosted fake REST API that returns realistic (if canned) JSON for common resources like users built for practicing API testing against something real without needing a backend of your own.`,
    `This repo is meant to run the same test cases two ways: manually in Postman first to explore the API, then automated with Playwright's request fixture for CI. Coverage follows a fixed checklist per endpoint - happy paths, status codes, response schema, negative/edge cases, auth, idempotency, headers, data persistence, and a rough performance baseline.`,
    `The code below is a pair of single tests from the repo, to view the entire suite go to the repo on GitHub.`,
  ],
} as const

export type ApiTestingExample = {
  id: string
  tag: string
  title: string
  description: string
  filename: string
  language: 'typescript'
  code: string
}

export { apiTestingExamples } from './apiTesting.generated'
