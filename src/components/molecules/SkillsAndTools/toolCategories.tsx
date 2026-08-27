import type { ReactNode } from 'react'
import {
  SiBitbucket,
  SiConfluence,
  SiCypress,
  SiElectron,
  SiFigma,
  SiGithub,
  SiJavascript,
  SiJest,
  SiJira,
  SiNodedotjs,
  SiPostman,
  SiQase,
  SiReact,
  SiSelenium,
  SiTestinglibrary,
  SiTypescript,
  SiVercel,
  SiVite,
  SiVitest,
} from 'react-icons/si'
import { MaestroIcon, PlaywrightIcon, ReactNativeIcon, SlackIcon } from '../../atoms/icons/BrandIcons'
import { PerformanceIcon } from '../../atoms/icons/TestingTypeIcons'

export type Tool = {
  name: string
  icon: ReactNode
}

export type ToolCategory = {
  id: string
  ariaLabel: string
  colorway: 'languages' | 'testing' | 'tools'
  tools: Tool[]
}

// Order matters: categories render as one continuous waterfalling grid (see
// SkillsAndTools.module.css), so tools flow in this array's order — each
// category's chips pick up wherever the previous one left off, not
// necessarily starting a new row.
export const toolCategories: ToolCategory[] = [
  {
    id: 'testing',
    ariaLabel: 'Testing',
    colorway: 'testing',
    tools: [
      { name: 'Playwright', icon: <PlaywrightIcon aria-hidden="true" /> },
      { name: 'Cypress', icon: <SiCypress aria-hidden="true" /> },
      { name: 'Maestro', icon: <MaestroIcon aria-hidden="true" /> },
      { name: 'Jest', icon: <SiJest aria-hidden="true" /> },
      // This site's own unit tests run on Vitest (see src/**/*.test.tsx) and
      // it's one of the two frameworks offered live in the Automation
      // Examples panel's Component tier.
      { name: 'Vitest', icon: <SiVitest aria-hidden="true" /> },
      { name: 'Selenium', icon: <SiSelenium aria-hidden="true" /> },
      // Shortened from "React Native Testing Library" — at a glance in the
      // grid it read as a duplicate of the "React Native" entry (Languages
      // and frameworks, below).
      { name: 'RNTL', icon: <SiTestinglibrary aria-hidden="true" /> },
      // Reassure has no icon anywhere on Iconify (searched all collections,
      // zero results) — it's a React Native performance-testing tool, so the
      // same speed-dial glyph used for "Performance" in CodeSamples reads as
      // the concept directly rather than a new bespoke glyph.
      { name: 'Reassure', icon: <PerformanceIcon aria-hidden="true" /> },
    ],
  },
  {
    id: 'languages-frameworks',
    ariaLabel: 'Languages and frameworks',
    colorway: 'languages',
    tools: [
      { name: 'TypeScript', icon: <SiTypescript aria-hidden="true" /> },
      { name: 'JavaScript', icon: <SiJavascript aria-hidden="true" /> },
      { name: 'React', icon: <SiReact aria-hidden="true" /> },
      { name: 'React Native', icon: <ReactNativeIcon aria-hidden="true" /> },
      { name: 'Node.js', icon: <SiNodedotjs aria-hidden="true" /> },
      { name: 'Vite', icon: <SiVite aria-hidden="true" /> },
      // The Master Tour Desktop app (see CS 2 in caseStudies.ts) — the real
      // platform this site's own README references as the reason Playwright
      // was chosen over WebDriverIO.
      { name: 'Electron', icon: <SiElectron aria-hidden="true" /> },
    ],
  },
  {
    id: 'tools',
    ariaLabel: 'Tools',
    colorway: 'tools',
    tools: [
      { name: 'Jira', icon: <SiJira aria-hidden="true" /> },
      { name: 'Confluence', icon: <SiConfluence aria-hidden="true" /> },
      { name: 'Bitbucket', icon: <SiBitbucket aria-hidden="true" /> },
      // Simple Icons added a Qase mark after this component's earlier design
      // pass assumed there wasn't one — use the real logo instead of a
      // lettered fallback badge.
      { name: 'Qase', icon: <SiQase aria-hidden="true" /> },
      { name: 'Postman', icon: <SiPostman aria-hidden="true" /> },
      { name: 'Figma', icon: <SiFigma aria-hidden="true" /> },
      { name: 'Slack', icon: <SlackIcon aria-hidden="true" /> },
      { name: 'GitHub', icon: <SiGithub aria-hidden="true" /> },
      // This site's own host — see the "live at jamesusher.vercel.app" link
      // in README.md.
      { name: 'Vercel', icon: <SiVercel aria-hidden="true" /> },
    ],
  },
]
