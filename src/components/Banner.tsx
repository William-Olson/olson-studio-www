import React from 'react';
import { LogoTypes } from '../types/LogoTypes';
import { CustomLogo } from './CustomLogo';

export class Banner extends React.Component {
  public render() {
    return (
      <div className="p-20 w-90 text-center border-b-8 border-white">
        <header>
          <div className="flex justify-center">
            <div className="h-32 w-32">
              <CustomLogo logo={LogoTypes.Studio} />
            </div>
          </div>
          <h1 className="text-6xl font-mono pb-3">Olson Studio</h1>
          <p></p>
          <p className="font-thin">Portal</p>
        </header>
      </div>
    );
  }
}
