import { ReactElement } from 'react'
import LandingCard from './components/LandingCard'
import logo from './logos/logo.svg'
// import logoColor from './logos/logoColor.svg'
import zinasLogo from './logos/neo-VOLogoColor.svg'
import willsLogo from './logos/neo-WOLogoColor.svg'
import janasLogo from './logos/neo-JRLogoColor.svg'

function App(): ReactElement {
  return (
    <div className="md:w-[900px] max-w-[900px] opacity-95">
      <div className="p-20 w-90 text-center border-b-8 border-white">
        <header>
          <div className="flex justify-center">
            <img
              src={logo}
              className="h-32 w-32 hover:animate-spin-slow"
              alt="logo"
            />
          </div>
          <h1 className="text-6xl font-mono pb-3">Olson Studio</h1>
          <p></p>
          <p className="font-thin">Portal</p>
        </header>
      </div>
      <div className="p-9 text-center auto-cols-max md:border-l-8 md:border-r-8 border-white max-w-[650px] m-auto">
        <LandingCard
          logoSrc={willsLogo}
          name="Will"
          destination="https://william.olson.studio"
          subText="William's Studio"
        />
        <LandingCard
          logoSrc={zinasLogo}
          name="Zina"
          destination="https://zina.olson.studio"
          subText="Zina's Studio"
        />
        <LandingCard
          logoSrc={janasLogo}
          name="Jana"
          destination="https://jana.olson.studio"
          subText="Jana's Studio"
        />
        <LandingCard
          logoSrc={logo}
          name="More"
          destination="https://family.olson.studio"
          subText="Family Studio"
        />
      </div>
    </div>
  )
}

export default App
