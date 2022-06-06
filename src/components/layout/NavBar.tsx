import React from 'react';
import { DarkModeTypes, IconTypes } from '../../types/AppTypes';
import { toggleDarkMode } from '../../util/DarkMode';
import { Theme } from '../../util/Theme';
import { CustomIcon } from '../CustomIcon';

interface NavBarState {}
interface NavBarProps {
  darkModeType: DarkModeTypes;
  isDark: boolean;
  onChangeDarkMode: () => void;
}

const getToggleIcon = (
  isDark: boolean,
  modeType: DarkModeTypes,
  onChangeHandler: () => void
) => {
  const handleMode = (mode: DarkModeTypes) => {
    toggleDarkMode(mode);
    onChangeHandler();
  };

  switch (modeType) {
    case DarkModeTypes.ON:
      return (
        <button onClick={() => handleMode(DarkModeTypes.OFF)}>
          <CustomIcon
            className="ml-6 h-6 cursor-pointer"
            icon={IconTypes.Moon}
            color={Theme.colors.accent}
          />
        </button>
      );
    case DarkModeTypes.OFF:
      return (
        <button onClick={() => handleMode(DarkModeTypes.SYSTEM)}>
          <CustomIcon
            className="ml-6 h-6 cursor-pointer"
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
              className="ml-6 h-6 cursor-pointer"
              icon={IconTypes.Moon}
              color={'grey'}
            />
          </button>
        );
      }
      return (
        <button onClick={() => handleMode(DarkModeTypes.ON)}>
          <CustomIcon
            className="ml-6 h-6 cursor-pointer"
            icon={IconTypes.Sun}
            color={'grey'}
          />
        </button>
      );
    default:
      console.error('Unsupported dark mode icon type ', modeType);
  }
};

export class NavBar extends React.Component<NavBarProps, NavBarState> {
  public render() {
    const darkModeType = this.props.darkModeType;
    const isDark = this.props.isDark;
    const handler = this.props.onChangeDarkMode;

    return (
      <nav className="flex flex-row">
        <div className="nav-padding basis-4/5"></div>
        <div className="nav-section basis-1/5">
          <div className="flex flex-row p-4">
            <div className="flex-grow"></div>
            <a
              href="https://github.com/William-Olson/olson-studio-www"
              target="_blank"
              rel="noopener"
              aria-label={'Github Link'}
              className="ml-6 h-6 cursor-pointer"
            >
              <CustomIcon icon={IconTypes.Github} />
            </a>
            {getToggleIcon(isDark, darkModeType, handler)}
          </div>
        </div>
      </nav>
    );
  }
}
