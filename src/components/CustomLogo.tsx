import React, { FC, ReactElement, ReactSVGElement } from 'react';
import customLogoGetters, { LogoTypes } from '../types/LogoTypes';

export interface GetterParams extends React.SVGProps<ReactElement> {
  logo: LogoTypes;
  color?: string;
}

export const CustomLogo: FC<GetterParams> = (
  props: GetterParams
): ReactElement => {
  const logoGetter = customLogoGetters.get(props.logo);
  if (!logoGetter) {
    throw new Error('Unable to find custom logo getter for ' + props.logo);
  }

  if (!props.color) {
    // if (isDarkMode) {
    //   props.color = '#';
    // } else {
    //   props.color = '#';
    // }
  }

  return logoGetter(props.color);
};
