import Header from '../../organisms/Header/Header'
import About from '../../organisms/About/About'
import Experience from '../../organisms/Experience/Experience'
import CaseStudies from '../../organisms/CaseStudies/CaseStudies'
import CodeSamples from '../../organisms/CodeSamples/CodeSamples'
import ApiTesting from '../../organisms/ApiTesting/ApiTesting'
import Sidebar from '../../organisms/Sidebar/Sidebar'
import InfoPanel from '../../organisms/InfoPanel/InfoPanel'
import MobileInfoCard from '../../organisms/MobileInfoCard/MobileInfoCard'

function PortfolioTemplate() {
  return (
    <>
      <Header />
      <MobileInfoCard />
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
