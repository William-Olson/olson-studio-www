import { DarkModeTypes, IconTypes } from '../../../types/AppTypes';
import { toggleDarkMode } from '../../../util/DarkMode';
import { Theme } from '../../../util/Theme';
import { CustomIcon } from '../../CustomIcon';

export const getToggleIcon = (isDark: boolean, modeType: DarkModeTypes) => {
  const handleMode = (mode: DarkModeTypes) => {
    toggleDarkMode(mode);
  };

  switch (modeType) {
    case DarkModeTypes.ON:
      return (
        <button onClick={() => handleMode(DarkModeTypes.OFF)}>
          <CustomIcon
            className="pl-4 h-8 w-10 -mt-2 cursor-pointer"
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
            icon={IconTypes.Sun}
            color={isDark ? 'accent' : 'currentColor'}
          />
        </button>
      );
    case DarkModeTypes.SYSTEM:
      if (isDark) {
        return (
          <button onClick={() => handleMode(DarkModeTypes.ON)}>
            <CustomIcon
              className="pl-4 h-8 w-10 -mt-2 cursor-pointer"
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
            icon={IconTypes.Sun}
            color={'grey'}
          />
        </button>
      );
    default:
      console.error('Unsupported dark mode icon type ', modeType);
  }
};
