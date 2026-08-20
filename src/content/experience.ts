export type ExperienceSubsection = {
  name: string
  bullets: readonly string[]
}

export type ExperienceEntry = {
  id: string
  role: string
  company: string
  dates: string
  stack?: readonly string[]
  bullets: readonly string[]
  subsections?: readonly ExperienceSubsection[]
}

export const experience: readonly ExperienceEntry[] = [
  {
    id: 'eventric-qa-lead',
    role: 'QA Lead',
    company: 'Eventric Master Tour',
    dates: 'Jan 2025 – Aug 2026',
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
    bullets: [
      'Owned QA strategy and the end-to-end release process across eight products - final review, go-to-market coordination, and company-wide release status communication - reviewing 65+ release candidates and preventing 105+ escape defects',
      'Led a weekly, engineering-wide release review meeting reporting directly to the Head of Technology, providing go/no-go visibility on all in-flight releases across the company',
      "Selected and rolled out Qase as the team's manual test case tool; led the team in authoring 500+ manual test cases across 3 products, serving as a repeatable, trackable, and reportable quality gate",
      "Hired and led Eventric's second QA engineer, running the hiring process end-to-end with an external hiring partner",
      "Matured Eventric's QA function from ad hoc manual gates to a defined set of quality gates visible and enforced across the entire engineering org",
    ],
    subsections: [
      {
        name: 'Master Tour Mobile - React Native Mobile Application',
        bullets: [
          'Built a Maestro E2E smoke/regression suite (100+ cases) covering all 18 critical user flows, auto-triggered on every release-candidate build in Bitbucket',
          'Built a Jest/React Native Testing Library component suite (50+ component specs) running on every PR, taking full mobile app test coverage from near-zero to ~30%',
          'Stood up Reassure performance-regression testing across core UI components (Button, Card, Accordion, and others)',
        ],
      },
      {
        name: 'Master Tour Desktop - Electron Desktop Application',
        bullets: [
          'Initiated and led the rollout of a Playwright E2E framework from scratch - built auth fixtures, navigation/wait helpers, and a 31-file page-object architecture as part of a coordinated, multi-PR initiative',
        ],
      },
      {
        name: 'Master Tour Venue - Vite Web App',
        bullets: [
          'Maintained a Cypress E2E suite (100+ tests) and component suite (50+ component specs), running weekly and on every deploy',
        ],
      },
    ],
  },
  {
    id: 'eventric-software-automation-engineer',
    role: 'Software Automation Engineer',
    company: 'Eventric Master Tour',
    dates: 'Mar 2023 – Jan 2025',
    stack: [
      'TypeScript/JavaScript',
      'React',
      'React Native',
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
      'Google Workspace',
    ],
    bullets: [
      'Led test automation and QA efforts across 5 products, including a desktop and a mobile application',
      "Built a Cypress E2E automation suite from scratch covering all critical user flows (20 specs, 93 flows); integrated into CI/CD (Bitbucket Pipelines) to run on every pull request across the team's primary web product",
      "Built an atom/molecule-level component testing suite in the same framework and introduced it into Eventric's pipelines as a permanent quality gate for pull-request merges",
      "Stood up React Native Testing Library/Jest component testing for the company's new mobile product to ensure compounding quality during the early stages of app development",
      "Started and led a backlog-refinement initiative that reduced average backlog age across Eventric's 5 main products by 150 days",
      "Standardized Eventric's Confluence knowledge base (25+ docs) and created bug/story templates adopted company-wide",
      'Interfaced with clients and users for on-site feedback and product outreach; assisted the support team in diagnosing and mitigating high-priority user-reported issues',
    ],
  },
  {
    id: 'fubo-gaming-qa-specialist',
    role: 'QA Specialist',
    company: 'Fubo Gaming',
    dates: 'Jun 2022 – Nov 2022',
    stack: ['JavaScript (Node.js, React Native)', 'Selenium/Cucumber', 'Confluence', 'Jira', 'Bitbucket', 'Figma'],
    bullets: [
      'Tested the Fubo Sportsbook web app and native mobile app using both manual and automated testing',
      'Wrote and groomed 200+ test cases covering core flows including new-user onboarding, money deposit/withdrawal, and TV-to-sportsbook integration',
      'Created and maintained 15+ Confluence pages used department-wide for onboarding, feature testing standards, and general QA process',
      'Sole QA member supporting R&D on TV-service/sportsbook integration and third-party analytics API integration; interfaced with domestic and international teams to meet sports-betting industry standards',
    ],
  },
  {
    id: 'scientific-games-software-quality-engineer',
    role: 'Software Quality Engineer',
    company: 'Scientific Games',
    dates: 'Sep 2019 – Jun 2022',
    bullets: [
      'Owned the full QA lifecycle for 6 video slot games, each achieving first-time approval and certification from Gaming Laboratories International (GLI)',
      'Subject-matter expert on Jurisdictional Chip (localization) testing - tested and released a department-high 13 titles in a single year; trained fellow engineers on the release process',
    ],
  },
] as const
