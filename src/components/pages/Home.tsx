import React from 'react';
import { LogoTypes } from '../../types/AppTypes';
import { CustomLogo } from '../CustomLogo';
import { Banner } from '../layout/Banner';
import { CardArea } from '../layout/CardArea';

export class HomeComponent extends React.Component {
  public render() {
    return (
      <div className="md:w-[900px] max-w-[900px] opacity-95 m-auto">
        <Banner
          headingText="Olson Studio"
          subText="Portal"
          logo={<CustomLogo logo={LogoTypes.Studio} />}
        />
        <CardArea />
      </div>
    );
  }
}
