import React, { FC, ReactElement } from 'react';
import customLogoGetters from '../util/images/LogoTypes';
import { isDarkMode } from '../util/DarkMode';
import { LogoTypes } from '../types/AppTypes';

export interface GetterParams extends React.SVGProps<ReactElement> {
  logo: LogoTypes;
  color?: string;
}

export const CustomLogo: FC<GetterParams> = (
  props: GetterParams
): ReactElement => {
  const logoGetter = customLogoGetters.get(props.logo);
  let color = props.color;
  if (!logoGetter) {
    throw new Error('Unable to find custom logo getter for ' + props.logo);
  }

  if (!color) {
    if (isDarkMode()) {
      color = '#DBD9D4';
    } else {
      color = '#1A0609';
    }
  }

  return logoGetter(color);
};
