import { links } from './links'

export type ExperienceEntry = {
  id: string
  role: string
  company: string
  companyUrl: string
  dates: string
  stack?: readonly string[]
  summary: string
}

export const experience: readonly ExperienceEntry[] = [
  {
    id: 'eventric-qa-lead',
    role: 'QA Lead / Senior SDET',
    company: 'Eventric Master Tour',
    companyUrl: links.companies.eventric,
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
      "Owned QA strategy and the release process across Eventric's entire 8 product suite. Led engineering-wide release review meetings, built out automated coverage across the mobile, desktop, and web apps, and established engineering-wide quality standards. Grew the quality team by hiring Eventric's second quality engineer. Interfaced with clients, customer support, and in-house product team to ensure the overall quality of the project not just from a code standard, but from a client standard",
  },
  {
    id: 'eventric-sdet',
    role: 'Software Development Engineer in Test',
    company: 'Eventric Master Tour',
    companyUrl: links.companies.eventric,
    dates: 'Mar 2023 – Jan 2025',
    stack: [
      'TypeScript/JavaScript',
      'React',
      'React Native',
      'Cypress',
      'Jest',
      'Postman',
      'Bugsnag',
      'Figma',
      'Jira',
      'Confluence',
      'Bitbucket',
      'Slack',
    ],
    summary:
      "Built repeatable testing standards from scratch across five products, standing up Eventric's first E2E and component-testing framework for its web Venue product while leading backlog and documentation initiatives. Started Eventric's first ever standing backlog grooming session, reducing the average age of the backlog by 150+ days",
  },
  {
    id: 'fubo-gaming-qa-specialist',
    role: 'QA Specialist',
    company: 'Fubo Gaming',
    companyUrl: links.companies.fubo,
    dates: 'Jun 2022 – Nov 2022',
    stack: ['JavaScript (Node.js, React Native)', 'Selenium/Cucumber', 'Confluence', 'Jira', 'Bitbucket', 'Figma'],
    summary:
      'Owned manual and automated testing for the Fubo Sportsbook web and mobile apps. Selected to be the sole QA on R&D based on perspicacity, handling the testing of the TV-to-sportsbook integration',
  },
  {
    id: 'scientific-games-software-quality-engineer',
    role: 'Software Quality Engineer',
    company: 'Scientific Games',
    companyUrl: links.companies.scientificGames,
    dates: 'Sep 2019 – Jun 2022',
    summary:
      "Owned the QA lifecycle for six video slot games through first-time GLI certification. Became the team's subject-matter expert on jurisdictional localization testing, releasing 13 titles in a year and mentoring fellow engineers on the process.",
  },
] as const
