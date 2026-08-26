// Single source of truth for every external URL/handle referenced across
// content files (site.ts, experience.ts, ...), so a link only ever needs to
// change in one place.
export const links = {
  linkedin: 'https://www.linkedin.com/in/james-usher-b6a859a8/',
  github: 'https://github.com/WRTHY',
  email: 'jamesusher1633@gmail.com',
  resume: '/James_Usher_Resume.pdf',
  companies: {
    eventric: 'https://www.eventric.com/',
    fubo: 'https://www.fubo.tv/welcome',
    scientificGames: 'https://www.lnw.com/',
  },
} as const
