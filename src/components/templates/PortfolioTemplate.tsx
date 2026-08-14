import Header from '../organisms/Header'
import Hero from '../organisms/Hero'
import About from '../organisms/About'
import CaseStudies from '../organisms/CaseStudies'
import CodeSamples from '../organisms/CodeSamples'
import Sidebar from '../organisms/Sidebar'
import { siteContent } from '../../content/site'

function PortfolioTemplate() {
  return (
    <>
      <Header />
      <Sidebar />
      <Hero name={siteContent.name} tagline={siteContent.tagline} />
      <CaseStudies />
      <CodeSamples />
      <About />
    </>
  )
}

export default PortfolioTemplate
