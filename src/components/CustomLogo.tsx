import React, { ReactElement } from 'react';
import customLogoGetters from '../util/images/LogoTypes';
import { LogoTypes } from '../types/AppTypes';
import { observer } from 'mobx-react';
import { DarkModeState } from '../stores/DarkModeStore';

export interface LogoProps extends React.SVGProps<ReactElement> {
  logo: LogoTypes;
  color?: string;
}

class CustomLogoComponent extends React.Component<LogoProps> {
  private darkMode: typeof DarkModeState = DarkModeState;
  render() {
    const logoGetter = customLogoGetters.get(this.props.logo);
    let color = this.props.color;
    if (!logoGetter) {
      throw new Error(
        'Unable to find custom logo getter for ' + this.props.logo
      );
    }

    if (!color) {
      if (this.darkMode?.isDark) {
        color = '#DBD9D4';
      } else {
        color = '#1A0609';
      }
    }

    return logoGetter(color);
  }
}

export const CustomLogo = observer(CustomLogoComponent);
