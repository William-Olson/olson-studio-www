import { DarkModeTypes, IconTypes } from '../../../types/AppTypes';
import { inject, observer } from 'mobx-react';
import { Theme } from '../../../util/Theme';
import { CustomIcon } from '../../CustomIcon';
import { DarkModeState } from '../../../stores/DarkModeStore';

interface ToggleIconProps {
  darkMode?: typeof DarkModeState;
}

export const DarkModeToggle: React.FC<ToggleIconProps> = inject('darkMode')(
  observer((props: ToggleIconProps) => {
    const handleMode = (mode: DarkModeTypes) => {
      props.darkMode?.toggleDarkMode(mode);
    };

    switch (props.darkMode?.darkModeType) {
      case DarkModeTypes.ON:
        return (
          <button onClick={() => handleMode(DarkModeTypes.OFF)}>
            <CustomIcon
              className="pl-4 h-8 w-10 -mt-2 cursor-pointer"
              darkMode={props.darkMode}
              icon={IconTypes.Moon}
              color={Theme.colors.accent}
            />
          </button>
        );
      case DarkModeTypes.OFF:
        return (
          <button onClick={() => handleMode(DarkModeTypes.SYSTEM)}>
            <CustomIcon
              className="pl-4 h-8 w-10 -mt-2 cursor-pointer"
              darkMode={props.darkMode}
              icon={IconTypes.Sun}
              color={props.darkMode?.isDark ? 'accent' : 'currentColor'}
            />
          </button>
        );
      case DarkModeTypes.SYSTEM:
        if (props.darkMode?.isDark) {
          return (
            <button onClick={() => handleMode(DarkModeTypes.ON)}>
              <CustomIcon
                className="pl-4 h-8 w-10 -mt-2 cursor-pointer"
                darkMode={props.darkMode}
                icon={IconTypes.Moon}
                color={'grey'}
              />
            </button>
          );
        }
        return (
          <button onClick={() => handleMode(DarkModeTypes.ON)}>
            <CustomIcon
              className="pl-4 h-8 w-10 -mt-2 cursor-pointer"
              darkMode={props.darkMode}
              icon={IconTypes.Sun}
              color={'grey'}
            />
          </button>
        );
      default:
        console.error(
          'Unsupported dark mode icon type ',
          props.darkMode?.darkModeType
        );
        return <></>;
    }
  })
);
