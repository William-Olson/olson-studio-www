import React from 'react';
import { LogoTypes } from '../../types/AppTypes';
import { CustomLogo } from '../CustomLogo';

export class Banner extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <div className="pb-20 w-90 text-center">
          <header>
            <div className="flex justify-center">
              <div className="h-32 w-32">
                <CustomLogo logo={LogoTypes.Studio} />
              </div>
            </div>
            <h1 className="text-6xl font-mono pb-3">Olson Studio</h1>
            <p></p>
            <p className="font-sans font-bold from-accent-dark to-white">
              Portal
            </p>
          </header>
        </div>
      </React.Fragment>
    );
  }
}
