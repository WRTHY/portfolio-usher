import { useState } from 'react'
import Opener from '../../organisms/Opener/Opener'
import Header from '../../organisms/Header/Header'
import Hero from '../../organisms/Hero/Hero'
import Experience from '../../organisms/Experience/Experience'
import CaseStudies from '../../organisms/CaseStudies/CaseStudies'
import Projects from '../../organisms/Projects/Projects'
import Contact from '../../organisms/Contact/Contact'
import Footer from '../../organisms/Footer/Footer'
import Sidebar from '../../organisms/Sidebar/Sidebar'

function PortfolioTemplate() {
  // The name hand-off: the hero reports when its big name has scrolled up
  // under the top bar, and only then does the bar show the name. Starts
  // false because the page loads at the hero; a reload further down gets
  // corrected by the hero's first report.
  const [heroNameGone, setHeroNameGone] = useState(false)

  return (
    <>
      <Opener />
      <Header showName={heroNameGone} />
      <Sidebar />
      <main>
        <Hero onNameGoneChange={setHeroNameGone} />
        <Experience />
        <Projects />
        <CaseStudies />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default PortfolioTemplate
