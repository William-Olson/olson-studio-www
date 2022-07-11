import { FC, ReactElement } from 'react';
import { IconTypes } from '../types/AppTypes';
import { isDarkMode } from '../util/DarkMode';
import Icons, { IconProps } from '../util/images/Icons';

export interface IconParams extends IconProps {
  icon: IconTypes;
  color?: string;
}

export const CustomIcon: FC<IconParams> = (props: IconParams): ReactElement => {
  const iconGetter = Icons[props.icon];
  let color = props.color;
  if (!iconGetter) {
    throw new Error('Unable to find custom logo getter for ' + props.icon);
  }

  if (!color) {
    if (isDarkMode()) {
      color = '#DBD9D4';
    } else {
      color = '#1A0609';
    }
  }

  return iconGetter(color, props);
};
