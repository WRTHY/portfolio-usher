import Header from '../../organisms/Header/Header'
import About from '../../organisms/About/About'
import Experience from '../../organisms/Experience/Experience'
import CaseStudies from '../../organisms/CaseStudies/CaseStudies'
import CodeSamples from '../../organisms/CodeSamples/CodeSamples'
import ApiTesting from '../../organisms/ApiTesting/ApiTesting'
import Sidebar from '../../organisms/Sidebar/Sidebar'
import InfoPanel from '../../organisms/InfoPanel/InfoPanel'

// MobileInfoCard isn't rendered here - each section renders its own
// instance instead (see MobileInfoCard.tsx for why).
function PortfolioTemplate() {
  return (
    <>
      <Header />
      <Sidebar />
      <InfoPanel />
      <About />
      <Experience />
      <CaseStudies />
      <CodeSamples />
      <ApiTesting />
    </>
  )
}

export default PortfolioTemplate
