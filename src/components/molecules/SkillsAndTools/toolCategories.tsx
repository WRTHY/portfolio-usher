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
  colorway: 'languages' | 'testing' | 'tools' | 'devops'
  tools: Tool[]
}

// Order matters: categories render as one continuous waterfalling grid (see
// SkillsAndTools.module.css), so chips flow in this array's order.
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
      { name: 'Vitest', icon: <SiVitest aria-hidden="true" /> },
      { name: 'Selenium', icon: <SiSelenium aria-hidden="true" /> },
      // Shortened from "React Native Testing Library": read as a duplicate
      // of "React Native" below at a glance.
      { name: 'RNTL', icon: <SiTestinglibrary aria-hidden="true" /> },
      // No Iconify icon exists for Reassure; reuses CodeSamples' Performance glyph.
      { name: 'Reassure', icon: <PerformanceIcon aria-hidden="true" /> },
      { name: 'Qase', icon: <SiQase aria-hidden="true" /> },
      { name: 'Postman', icon: <SiPostman aria-hidden="true" /> },
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
      { name: 'Figma', icon: <SiFigma aria-hidden="true" /> },
      { name: 'Slack', icon: <SlackIcon aria-hidden="true" /> },
    ],
  },
  {
    id: 'devops',
    ariaLabel: 'DevOps',
    colorway: 'devops',
    tools: [
      { name: 'GitHub', icon: <SiGithub aria-hidden="true" /> },
      { name: 'Bitbucket', icon: <SiBitbucket aria-hidden="true" /> },
      { name: 'Vercel', icon: <SiVercel aria-hidden="true" /> },
    ],
  },
]
