import { FC, ReactElement } from 'react';
import { IconTypes } from '../types/AppTypes';
import { observer } from 'mobx-react';
import Icons, { IconProps } from '../util/images/Icons';
import { DarkModeState } from '../stores/DarkModeStore';

export interface IconParams extends IconProps {
  icon: IconTypes;
  color?: string;
  darkMode?: typeof DarkModeState;
}

export const CustomIcon: FC<IconParams> = observer(
  (props: IconParams): ReactElement => {
    const iconGetter = Icons[props.icon];
    let color = props.color;
    if (!iconGetter) {
      throw new Error('Unable to find custom logo getter for ' + props.icon);
    }

    if (!color) {
      if (props.darkMode?.isDark) {
        color = '#DBD9D4';
      } else {
        color = '#1A0609';
      }
    }
    const params = Object.assign({}, props);
    delete params['darkMode'];
    return iconGetter(color, params);
  }
);
