import { links } from './links'

// Focused for SDET / test automation / hands-on QA lead roles. Every figure
// here is one already on James's resume; nothing is new or internal-only.

export type KeyTool = {
  tool: string
  /** What the role tested with it, in a few words: 'mobile E2E'. */
  scope: string
  /** The stack entries this one stands for, when its name is a shorthand
   *  ('Jest + RNTL'). The expanded tools column leaves these out so nothing
   *  is listed twice. */
  covers?: readonly string[]
}

/** The stack entries a role's key tools don't already show: what the tools
 *  column adds when the role is opened. */
export function remainingStack(entry: ExperienceEntry): readonly string[] {
  const shown = new Set(entry.keyTools.flatMap(({ tool, covers }) => covers ?? [tool]))
  return (entry.stack ?? []).filter((item) => !shown.has(item))
}

export type ExperienceEntry = {
  id: string
  role: string
  company: string
  companyUrl: string
  dates: string
  /** The one sentence the Experience ledger shows: the role's headline
   *  outcome, written for SDET / test automation hiring. */
  impact: string
  /** Up to four test frameworks the role automated with, each with what it
   *  tested, e.g. Maestro for mobile E2E. Frameworks only: languages and the
   *  rest of the toolchain live in `stack`. Empty when there's no honest
   *  list for the role yet. */
  keyTools: readonly KeyTool[]
  /** Shown when the row's "+" is opened: scope, ownership, what was built. */
  details: readonly string[]
  /** The full tool list, also shown when the row is opened. */
  stack?: readonly string[]
}

// Placeholder (Claude's, in COPY.md): above the tool tiles under the ledger.
export const skillsHeading = 'Skills & tools'

// One-line framing shown beside the Experience heading.
export const experienceIntro =
  'SDET and QA lead who builds test automation and release gates from scratch across web, desktop and mobile apps.'

export const experience: readonly ExperienceEntry[] = [
  {
    id: 'eventric-qa-lead',
    role: 'QA Lead / Senior SDET',
    company: 'Eventric Master Tour',
    companyUrl: links.companies.eventric,
    dates: 'Jan 2025 – Aug 2026',
    impact:
      'Built the quality program from scratch: Maestro, Playwright and Cypress automation plus release gates; 65+ release candidates reviewed, 105+ escaped defects prevented.',
    keyTools: [
      { tool: 'Maestro', scope: 'mobile E2E' },
      { tool: 'Playwright', scope: 'desktop E2E' },
      { tool: 'Cypress', scope: 'web E2E + component' },
      { tool: 'Jest + RNTL', scope: 'mobile component', covers: ['Jest', 'React Native Testing Library'] },
    ],
    details: [
      'Owned QA strategy and the release process across eight products: final review, release coordination and company-wide release status.',
      'Ran a weekly engineering-wide release review reporting to the Head of Technology, giving go/no-go visibility on every in-flight release.',
      'Mobile (React Native): a Maestro suite of 100+ cases across 18 critical flows on every release-candidate build; 50+ Jest / React Native Testing Library specs on every PR, taking coverage from near-zero to about 30%; Reassure performance-regression tests.',
      'Desktop and web: a Playwright framework from scratch for the Electron app (auth fixtures, helpers, a 31-file page-object architecture) and a Cypress suite of 100+ E2E tests and 50+ component specs. Hired and led a second QA engineer.',
    ],
    stack: [
      'TypeScript/JavaScript',
      'React',
      'React Native',
      'Maestro',
      'Playwright',
      'Cypress',
      'Jest',
      'React Native Testing Library',
      'Reassure',
      'Qase',
      'Postman/Apidog',
      'Bitbucket',
      'LaunchDarkly',
      'Bugsnag',
      'Firebase',
      'Jira',
      'Confluence',
      'Figma',
    ],
  },
  {
    id: 'eventric-sdet',
    role: 'Software Development Engineer in Test',
    company: 'Eventric Master Tour',
    companyUrl: links.companies.eventric,
    dates: 'Mar 2023 – Jan 2025',
    impact:
      'Built a Cypress E2E suite from scratch (20 specs, 93 flows) that runs on every pull request, plus a component-test merge gate and the first React Native test setup.',
    keyTools: [
      { tool: 'Cypress', scope: 'web E2E + component' },
      { tool: 'Jest + RNTL', scope: 'mobile component', covers: ['Jest', 'React Native Testing Library'] },
      { tool: 'Qase', scope: 'manual test cases' },
    ],
    details: [
      'A Cypress suite covering every critical user flow on the primary web product, integrated into Bitbucket Pipelines on every PR.',
      'An atom- and molecule-level component suite, introduced as a permanent quality gate for PR merges.',
      'Jest / React Native Testing Library component testing for the new mobile product, from its early stages of development.',
      'Led test automation and QA across five products, including a desktop and a mobile app.',
      "Started Eventric's first standing backlog grooming session, cutting the backlog's average age by 150+ days.",
    ],
    stack: [
      'TypeScript/JavaScript',
      'React',
      'React Native',
      'Cypress',
      'Jest',
      'React Native Testing Library',
      'Qase',
      'Postman',
      'Bugsnag',
      'Bitbucket',
      'Jira',
      'Confluence',
      'Figma',
    ],
  },
  {
    id: 'fubo-gaming-qa-specialist',
    role: 'QA Specialist',
    company: 'Fubo Gaming',
    companyUrl: links.companies.fubo,
    dates: 'Jun 2022 – Nov 2022',
    impact:
      'Tested a sportsbook web and native mobile app, wrote and groomed 200+ test cases, and was the sole QA on the TV-to-sportsbook and analytics API integration R&D.',
    keyTools: [
      { tool: 'Selenium', scope: 'UI automation' },
      { tool: 'TestRail', scope: 'manual test cases' },
    ],
    details: [
      'Manual and automated testing of core flows: onboarding, deposits and withdrawals.',
      'Sole QA supporting R&D on the TV-service-to-sportsbook integration and a third-party analytics API integration.',
      'Worked with domestic and international teams to meet sports-betting industry standards.',
    ],
    stack: ['JavaScript (Node.js, React Native)', 'Selenium', 'TestRail', 'Jira', 'Confluence', 'Bitbucket', 'Figma'],
  },
  {
    id: 'scientific-games-software-quality-engineer',
    role: 'Software Quality Engineer',
    company: 'Scientific Games',
    companyUrl: links.companies.scientificGames,
    dates: 'Sep 2019 – Jun 2022',
    impact:
      'Owned the full QA lifecycle for 6 video slot games, each certified on first submission, and tested and released a department-high 13 localization titles in one year.',
    keyTools: [{ tool: 'Zephyr', scope: 'manual test cases' }],
    details: [
      'Full QA lifecycle ownership in a regulated, certification-driven environment.',
      "The team's subject-matter expert on jurisdictional localization testing.",
      'Trained fellow engineers on the release process.',
    ],
  },
] as const

export type EducationEntry = {
  id: string
  degree: string
  school: string
  schoolUrl: string
  /** Graduation, shown in the dates column. */
  dates: string
}

// The last row of the Experience ledger, and the root of its git-graph:
// where the career starts.
export const education: EducationEntry = {
  id: 'rose-hulman-bs-computer-engineering',
  degree: 'B.S. Computer Engineering',
  school: 'Rose-Hulman Institute of Technology',
  schoolUrl: links.schools.roseHulman,
  dates: 'May 2019',
}
