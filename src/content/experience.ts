export type ExperienceEntry = {
  id: string
  role: string
  company: string
  dates: string
  stack?: readonly string[]
  summary: string
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
    summary:
      "Own QA strategy and the release process across Eventric's entire product suite - leading company-wide release reviews, building out automated coverage across the mobile, desktop, and web apps, and hiring and growing the QA team.",
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
    summary:
      "Built test automation from scratch across five products, standing up Eventric's first E2E and component-testing frameworks for its web and mobile apps while leading backlog and documentation initiatives.",
  },
  {
    id: 'fubo-gaming-qa-specialist',
    role: 'QA Specialist',
    company: 'Fubo Gaming',
    dates: 'Jun 2022 – Nov 2022',
    stack: ['JavaScript (Node.js, React Native)', 'Selenium/Cucumber', 'Confluence', 'Jira', 'Bitbucket', 'Figma'],
    summary:
      'Owned manual and automated testing for the Fubo Sportsbook web and mobile apps, serving as the sole QA lead on TV-to-sportsbook integration and third-party analytics work.',
  },
  {
    id: 'scientific-games-software-quality-engineer',
    role: 'Software Quality Engineer',
    company: 'Scientific Games',
    dates: 'Sep 2019 – Jun 2022',
    summary:
      "Owned the QA lifecycle for six video slot games through first-time GLI certification, becoming the team's subject-matter expert on jurisdictional localization testing.",
  },
] as const
