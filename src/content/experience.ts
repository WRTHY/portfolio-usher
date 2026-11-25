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
  /** The short line the Experience ledger shows: the role's headline
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

// Placeholders (Claude's, in COPY.md). The heading names the tool strip for
// screen readers; the hint sits under it until a tool is chosen.
export const skillsHeading = 'Skills & tools'
export const skillsHint = 'Point at or tap a tool to see where I used it.'
// The status line's link to Projects, for a tool used there: after the
// roles that used it, or alone ("GitHub: used in my Projects").
export const skillsInProjects = { alone: 'used in my', link: 'Projects' }

// One-line framing shown beside the Experience heading.
export const experienceIntro =
  'SDET and QA lead who builds test automation and release gates across web, desktop and mobile apps.'

export const experience: readonly ExperienceEntry[] = [
  {
    id: 'eventric-qa-lead',
    role: 'QA Lead / Senior SDET',
    company: 'Eventric Master Tour',
    companyUrl: links.companies.eventric,
    dates: 'Jan 2025 – Aug 2026',
    impact:
      'Matured the quality function across all company products, building a program that reviewed 65+ release candidates and prevented 105+ escaped defects.',
    keyTools: [
      { tool: 'Maestro', scope: 'mobile E2E' },
      { tool: 'Playwright', scope: 'desktop E2E' },
      { tool: 'Cypress', scope: 'web E2E + component' },
      { tool: 'Jest + RNTL', scope: 'mobile component', covers: ['Jest', 'React Native Testing Library'] },
    ],
    details: [
      'Owned QA strategy and releases across 8 products, running a weekly go/no-go review for the Head of Technology.',
      'Rolled out Qase and led the team in writing 500+ manual test cases across 3 products.',
      "Hired and led Eventric's second QA engineer.",
      'Mobile app: built a Maestro E2E suite (100+ cases, all 18 critical flows), 50+ Jest / RNTL component specs taking coverage to ~30%, and Reassure performance tests.',
      'Desktop app: architected a Playwright E2E framework with auth fixtures, navigation and wait helpers, and a 31-file page-object model.',
      'Web app: built and maintained a Cypress E2E suite (100+ tests) and component suite (50+ specs), run weekly and on every deploy.',
    ],
    stack: [
      'TypeScript/JavaScript',
      'React',
      'React Native',
      'Electron',
      'Maestro',
      'Playwright',
      'Cypress',
      'Jest',
      'React Native Testing Library',
      'Reassure',
      'Qase',
      'Jira',
      'Confluence',
      'Bitbucket',
      'Postman/Apidog',
      'LaunchDarkly',
      'Bugsnag',
      'Firebase',
      'Slack',
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
      "Eventric's first QA hire. Handled testing of five core products and built the company's first Cypress E2E framework and suites.",
    keyTools: [
      { tool: 'Cypress', scope: 'web E2E + component' },
      { tool: 'Jest + RNTL', scope: 'mobile component', covers: ['Jest', 'React Native Testing Library'] },
    ],
    details: [
      'Started and led a backlog-refinement initiative that cut average backlog age by 150 days.',
      "Standardized Eventric's Confluence knowledge base (25+ docs) and created bug and story templates adopted company-wide.",
      'Met clients and users on site for feedback, and helped support diagnose high-priority user-reported issues.',
    ],
    stack: [
      'TypeScript/JavaScript',
      'React',
      'React Native',
      'Electron',
      'Cypress',
      'Jest',
      'React Native Testing Library',
      'Postman',
      'Bugsnag',
      'Figma',
      'Jira',
      'Confluence',
      'Bitbucket',
      'Slack',
    ],
  },
  {
    id: 'fubo-gaming-qa-specialist',
    role: 'QA Specialist',
    company: 'Fubo Gaming',
    companyUrl: links.companies.fubo,
    dates: 'Jun 2022 – Nov 2022',
    impact:
      'Tested a sportsbook app built for web and native mobile, including TV-to-sportsbook R&D work.',
    keyTools: [
      { tool: 'Selenium + Cucumber', scope: 'UI automation', covers: ['Selenium/Cucumber'] },
      { tool: 'TestRail', scope: 'manual test cases' },
    ],
    details: [
      'Wrote and groomed 200+ test cases across core flows: new-user onboarding, deposits and withdrawals, and the TV-to-sportsbook integration.',
      'Created and maintained 15+ Confluence pages used department-wide for onboarding, feature testing standards and QA process.',
    ],
    stack: ['JavaScript (Node.js, React Native)', 'Selenium/Cucumber', 'TestRail', 'Confluence', 'Jira', 'Bitbucket', 'Figma'],
  },
  {
    id: 'scientific-games-software-quality-engineer',
    role: 'Software Quality Engineer',
    company: 'Scientific Games',
    companyUrl: links.companies.scientificGames,
    dates: 'Sep 2019 – Jun 2022',
    impact:
      'Owned the full QA lifecycle for 6 video slot games.',
    keyTools: [{ tool: 'Tricentis qTest', scope: 'manual test cases' }],
    details: [
      'Full QA lifecycle ownership in a regulated environment, with every game approved and certified by Gaming Laboratories International (GLI) on first submission.',
      'Planned and executed large-scale soak and performance testing on proprietary hardware.',
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
