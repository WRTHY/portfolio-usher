import Header from '../organisms/Header'
import Hero from '../organisms/Hero'
import About from '../organisms/About'
import CaseStudies from '../organisms/CaseStudies'
import CodeSamples from '../organisms/CodeSamples'
import Contact from '../organisms/Contact'
import { siteContent } from '../../content/site'

function PortfolioTemplate() {
  return (
    <>
      <Header />
      <Hero name={siteContent.name} tagline={siteContent.tagline} />
      <About />
      <CaseStudies />
      <CodeSamples />
      <Contact />
    </>
  )
}

export default PortfolioTemplate
