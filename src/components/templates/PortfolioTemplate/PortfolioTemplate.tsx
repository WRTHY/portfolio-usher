import Header from '../../organisms/Header/Header'
import Hero from '../../organisms/Hero/Hero'
import About from '../../organisms/About/About'
import CaseStudies from '../../organisms/CaseStudies/CaseStudies'
import CodeSamples from '../../organisms/CodeSamples/CodeSamples'
import Sidebar from '../../organisms/Sidebar/Sidebar'
import { siteContent } from '../../../content/site'

function PortfolioTemplate() {
  return (
    <>
      <Header />
      <Sidebar />
      <Hero name={siteContent.name} tagline={siteContent.tagline} resumeUrl={siteContent.resumeUrl} />
      <CaseStudies />
      <CodeSamples />
      <About />
    </>
  )
}

export default PortfolioTemplate
