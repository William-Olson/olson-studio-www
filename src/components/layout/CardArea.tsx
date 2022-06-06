import React from 'react';
import { LogoTypes } from '../../types/AppTypes';
import { CustomLogo } from '../CustomLogo';
import LandingCard from '../LandingCard';

export class CardArea extends React.Component {
  public render() {
    return (
      <div className="p-9 text-center auto-cols-max max-w-[650px] m-auto">
        <LandingCard
          logo={<CustomLogo logo={LogoTypes.Will} />}
          name="Will"
          destination="https://william.olson.studio"
          subText="William's Studio"
        />
        <LandingCard
          logo={<CustomLogo logo={LogoTypes.Zina} />}
          name="Zina"
          destination="https://zina.olson.studio"
          subText="Zina's Studio"
        />
        <LandingCard
          logo={<CustomLogo logo={LogoTypes.Jana} />}
          name="Jana"
          destination="https://jana.olson.studio"
          subText="Jana's Studio"
        />
        <LandingCard
          logo={<CustomLogo logo={LogoTypes.Studio} />}
          name="More"
          destination="https://family.olson.studio"
          subText="Family Studio"
        />
      </div>
    );
  }
}
