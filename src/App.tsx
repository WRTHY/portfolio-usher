import PortfolioTemplate from './components/templates/PortfolioTemplate/PortfolioTemplate'
import useViewportMode from './hooks/useViewportMode'

function App() {
  // Sets data-viewport on <html> - see the hook itself and index.css for
  // the [data-viewport] rules this drives across the mobile/desktop chrome.
  useViewportMode()
  return <PortfolioTemplate />
}

export default App
