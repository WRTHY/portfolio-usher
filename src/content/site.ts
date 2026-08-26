import { links } from './links'

export const siteContent = {
  name: 'James Usher',
  tagline:
    'SDET | QE Lead',
  quickSummary :
    'From Chaos, Quality - I build testing from scratch so nothing ships broken',
  resumeUrl: '/James_Usher_Resume.pdf',
} as const

export const socialLinks = [
  { id: 'linkedin', label: 'LinkedIn', href: links.linkedin },
  { id: 'github', label: 'GitHub', href: links.github },
  { id: 'email', label: 'Email', href: `mailto:${links.email}` },
] as const

export type AboutSegment = string | { text: string; href: string }

const EVENTRIC = { text: 'Eventric', href: 'https://www.eventric.com/' }
const FUBO = { text: 'Fubo', href: 'https://www.fubo.tv/welcome' }
const LIGHT_AND_WONDER = { text: 'Light & Wonder', href: 'https://www.lnw.com/' }
const MAESTRO = { text: 'Maestro', href: 'https://docs.maestro.dev/' }
const PLAYWRIGHT = { text: 'Playwright', href: 'https://playwright.dev/' }
const CYPRESS = { text: 'Cypress', href: 'https://docs.cypress.io/' }

export const about = {
  paragraphs: [
    [
      `Welcome to my portfolio! I'm James and I love building cool things. I'm a quality engineer from Chicago who gets immense satisfaction from walking into total chaos - no tests, no process, nothing - and leaving behind something that actually works. Architecting the testing/automation frameworks is only half the fun, I also love building and leading the team that ends up owning them. I semi-sarcastically wear the badge of "Personality Hire" with pride and maintain that I'm living proof that enjoying your job doesn't need to come at the cost of quality code`,
    ],

    [
      'Most recently, I was the Lead Quality Engineer at ',
      EVENTRIC,
      ". I joined as the company's QA 0-hire and ended up owning quality across all 8 of its products. In my time with the company, I built automated testing from scratch across three very different platforms - a React Native mobile app (",
      MAESTRO,
      '), an Electron desktop app (',
      PLAYWRIGHT,
      '), and a web platform (',
      CYPRESS,
      ") - hiring and leading the team's second QA engineer in the process. Before ",
      EVENTRIC,
      ', I spent time testing a live sports betting platform (web/mobile) at ',
      FUBO,
      ' and spent three years before that testing video slot games at Scientific Games (Now ',
      LIGHT_AND_WONDER,
      ').',
    ],

    [
      "I have built this portfolio as a way to show, rather than tell. Throughout my career I've always excelled at contributing to process and company-wide documentation - something that tends to fly under the radar on a resume. I have added a case studies section to capture a slice of that, and to walk through my actual thought process on larger-scale problems. Every example is written from real experience and real scenarios I've worked through. Additionally, I have spun up some rudimentary test automation pointed at this page - all of the test automation I wrote at my last position was proprietary and I wanted something to keep me sharp while looking for my next position. As a final piece, I have also kept this repository open to the public on Github. While I am a quality engineer by trade, my passion for creating things saw me spill out into software development at ",
      EVENTRIC,
      ', occasionally building out minor features or fixing the bugs that I found to give users quality of life improvements that I knew would be dropped to the bottom of our triage stack.',
    ],

    [
      'Outside of work, I have released music under the moniker "WRTHY" (Spotify, Apple Music), DJ under my own name "James Usher" (Youtube, Soundcloud), and I\'m a regular at rec soccer, volleyball, and ultimate frisbee. If anything I\'ve said here resonates with you or you just want to talk shop, music, or need someone tall for your next pickup game, hit me up via LinkedIn or at jamesusher1633@gmail.com',
    ],
  ] satisfies AboutSegment[][],
} as const
