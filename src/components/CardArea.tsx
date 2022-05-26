import React from 'react'
import LandingCard from './LandingCard'
import logo from '../logos/logo.svg'
import zinasLogo from '../logos/neo-VOLogoColor.svg'
import willsLogo from '../logos/neo-WOLogoColor.svg'
import janasLogo from '../logos/neo-JRLogoColor.svg'

export class CardArea extends React.Component {
  public render() {
    return (
      <div className="p-9 text-center auto-cols-max max-w-[650px] m-auto">
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
    )
  }
}
