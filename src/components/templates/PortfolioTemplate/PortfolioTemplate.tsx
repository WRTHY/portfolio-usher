import Header from '../../organisms/Header/Header'
import Hero from '../../organisms/Hero/Hero'
import About from '../../organisms/About/About'
import Experience from '../../organisms/Experience/Experience'
import CaseStudies from '../../organisms/CaseStudies/CaseStudies'
import CodeSamples from '../../organisms/CodeSamples/CodeSamples'
import Sidebar from '../../organisms/Sidebar/Sidebar'
import InfoPanel from '../../organisms/InfoPanel/InfoPanel'
import { siteContent } from '../../../content/site'

function PortfolioTemplate() {
  return (
    <>
      <Header />
      <Sidebar />
      <InfoPanel />
      <Hero name={siteContent.name} tagline={siteContent.tagline} resumeUrl={siteContent.resumeUrl} />
      <Experience />
      <CaseStudies />
      <CodeSamples />
      <About />
    </>
  )
}

export default PortfolioTemplate
