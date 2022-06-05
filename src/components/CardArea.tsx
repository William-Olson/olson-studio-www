import React from 'react';
import { LogoTypes } from '../types/LogoTypes';
import { CustomLogo } from './CustomLogo';
import LandingCard from './LandingCard';
// import logo from '../logos/logo.svg';
// import zinasLogo from '../logos/neo-VOLogoColor.svg';
// import willsLogo from '../logos/neo-WOLogoColor.svg';
// import janasLogo from '../logos/neo-JRLogoColor.svg';

// import logoWhite from '../logos/logoWhite.svg';
// import zinasLogoWhite from '../logos/neo-VOLogoWhite.svg';
// import willsLogoWhite from '../logos/neo-WOLogoWhite.svg';
// import janasLogoWhite from '../logos/neo-JRLogoWhite.svg';

export class CardArea extends React.Component {
  public render() {
    return (
      <div className="p-9 text-center auto-cols-max max-w-[650px] m-auto">
        <LandingCard
          logoSrc={<CustomLogo logo={LogoTypes.Will} />}
          name="Will"
          destination="https://william.olson.studio"
          subText="William's Studio"
        />
        <LandingCard
          logoSrc={<CustomLogo logo={LogoTypes.Zina} />}
          name="Zina"
          destination="https://zina.olson.studio"
          subText="Zina's Studio"
        />
        <LandingCard
          logoSrc={<CustomLogo logo={LogoTypes.Jana} />}
          name="Jana"
          destination="https://jana.olson.studio"
          subText="Jana's Studio"
        />
        <LandingCard
          logoSrc={<CustomLogo logo={LogoTypes.Studio} />}
          name="More"
          destination="https://family.olson.studio"
          subText="Family Studio"
        />
      </div>
    );
  }
}
