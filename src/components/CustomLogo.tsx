import React, { ReactElement } from 'react';
import customLogoGetters from '../util/images/LogoTypes';
import { isDarkMode } from '../util/DarkMode';
import { DarkModeTypes, LogoTypes } from '../types/AppTypes';
import { DarkModeComponent } from './helpers/DarkModeComponent';

export interface LogoProps extends React.SVGProps<ReactElement> {
  logo: LogoTypes;
  color?: string;
}

export interface LogoState extends React.SVGProps<ReactElement> {
  darkModeType: DarkModeTypes;
}

export class CustomLogo extends DarkModeComponent<LogoProps> {
  render() {
    const logoGetter = customLogoGetters.get(this.props.logo);
    let color = this.props.color;
    if (!logoGetter) {
      throw new Error(
        'Unable to find custom logo getter for ' + this.props.logo
      );
    }

    if (!color) {
      if (isDarkMode()) {
        color = '#DBD9D4';
      } else {
        color = '#1A0609';
      }
    }

    return logoGetter(color);
  }
}
