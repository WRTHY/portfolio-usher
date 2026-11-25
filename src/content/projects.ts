// Copy for the Projects section: two projects, this portfolio's own suite
// and the separate API suite, each a row that opens in place.
// Lines marked "James" are his own words, carried over from the sections
// this one replaced; lines marked "placeholder" were written by Claude and
// are listed in the local COPY.md for James to rewrite. The API suite's
// opened line is still in apiTesting.ts (James).
// The Skills & tools grid tools (see toolCategories.tsx) these two projects
// are built, tested or shipped with. The tool strip in Experience points to
// Projects for these, including the ones no role used (GitHub, Vercel).
export const projectTools: readonly string[] = [
  'Playwright',
  'Cypress',
  'Vitest',
  'Postman',
  'TypeScript',
  'JavaScript',
  'React',
  'Vite',
  'GitHub',
  'Vercel',
]

export const projectsCopy = {
  // James. Beside each project's name; its accessible name adds the
  // project's, since the two read the same.
  repoLink: 'Repo in Github',
  site: {
    // James.
    headline: 'This portfolio tests itself',
    // James's, tidied by Claude.
    description: 'This portfolio is more than just a fancy resume: I built (nay, overbuilt) test automation against it that runs on every pull request and every merge to master.',
    // James. Above the pipeline.
    pipelineLabel: 'The mental model',
  },
  api: {
    // Placeholder.
    name: 'API test suite',
    // James's, tidied by Claude.
    summary: 'To practice API testing for interviews, I built a small example suite against reqres.in, a third-party test API.',
  },
} as const
