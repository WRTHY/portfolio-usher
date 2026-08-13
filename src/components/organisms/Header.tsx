import Heading from '../atoms/Heading'
import Nav from '../molecules/Nav'

function Header() {
  return (
    <header>
      <Heading level={1}>Your Name</Heading>
      <Nav />
    </header>
  )
}

export default Header
