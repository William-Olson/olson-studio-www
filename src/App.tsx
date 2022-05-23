import { ReactElement } from 'react'
import LandingCard from './components/LandingCard'
import logo from './logos/logo.svg'
import logoWhite from './logos/logoWhite.svg'
import zinasLogo from './logos/neo-VOLogo.svg'
import willsLogo from './logos/neo-WOLogoWhite.svg'
import janasLogo from './logos/neo-JRLogo.svg'

function App(): ReactElement {
  return (
    <div className="xl:w-1/2">
      <div className="p-20 w-90 text-center border-b-2 border-accent">
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
          <p className="font-semibold">Curations</p>
        </header>
      </div>
      <div className="p-9 text-center auto-cols-max">
        <LandingCard
          logoSrc={willsLogo}
          name="William"
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
          logoSrc={logoWhite}
          name="More"
          destination="https://family.olson.studio"
          subText="Family Studio"
        />
      </div>
    </div>
  )
}

export default App
