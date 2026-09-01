// Content for the "API Testing" section — a deliberately static counterpart
// to codeExamples.ts (no framework switcher, no live playback). It points at
// a separate repo (see links.apiTestingRepo) that exercises reqres.in, a
// free hosted fake REST API, with Playwright's `request` fixture.
//
// `apiTestingExamples` below are placeholders only — swap each `code` field
// (and title/description/filename) for real snippets pulled verbatim from
// that repo once its test suite is written, the same way codeExamples.ts
// copies its files verbatim from this one.

export const apiTestingIntro = {
  paragraphs: [
    `reqres.in is a free, hosted fake REST API that returns realistic (if canned) JSON for common resources like users — built for exactly this: practicing API testing against something real without needing a backend of your own.`,
    `This repo runs the same test cases two ways: manually in Postman first to explore the API, then automated with Playwright's request fixture for CI. Coverage follows a fixed checklist per endpoint — happy paths, status codes, response schema, negative/edge cases, auth, idempotency, headers, data persistence, and a rough performance baseline.`,
  ],
} as const

export type ApiTestingExample = {
  id: string
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  title: string
  description: string
  filename: string
  language: 'typescript'
  code: string
}

export const apiTestingExamples: readonly ApiTestingExample[] = [
  // Placeholder — replace with the real listing-users spec once written.
  {
    id: 'list-users',
    method: 'GET',
    title: 'List users — happy path & schema',
    description:
      'Fetches a page of users and asserts both the status code and the response shape, not just that it returned something.',
    filename: 'tests/users/list-users.spec.ts',
    language: 'typescript',
    code: `import { test, expect } from '@playwright/test'

test.describe('GET /users', () => {
  test('returns 200 with a page of users matching the expected schema', async ({ request }) => {
    const response = await request.get('/api/users?page=2')
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body.page).toBe(2)
    expect(Array.isArray(body.data)).toBe(true)
    expect(body.data[0]).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        email: expect.stringContaining('@'),
        first_name: expect.any(String),
        last_name: expect.any(String),
      }),
    )
  })
})
`,
  },
  // Placeholder — replace with the real auth-failure spec once written.
  {
    id: 'login-negative',
    method: 'POST',
    title: 'Login — negative case (missing password)',
    description:
      "Confirms the API fails loudly and correctly when a request is malformed, rather than only testing the success path.",
    filename: 'tests/auth/login.spec.ts',
    language: 'typescript',
    code: `import { test, expect } from '@playwright/test'

test.describe('POST /login', () => {
  test('rejects a login attempt missing the password field', async ({ request }) => {
    const response = await request.post('/api/login', {
      data: { email: 'eve.holt@reqres.in' },
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Missing password')
  })
})
`,
  },
] as const
