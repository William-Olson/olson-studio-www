import React from 'react';
import { Link } from 'react-router-dom';
import { DarkModeChangeEvent, emitter } from '../../Events';
import { DarkModeTypes, IconTypes } from '../../types/AppTypes';
import {
  getDarkModeType,
  isDarkMode,
  toggleDarkMode
} from '../../util/DarkMode';
import { Theme } from '../../util/Theme';
import { CustomIcon } from '../CustomIcon';

interface NavBarState {
  darkModeType: DarkModeTypes;
  isDark: boolean;
}
interface NavBarProps {}

const getToggleIcon = (isDark: boolean, modeType: DarkModeTypes) => {
  const handleMode = (mode: DarkModeTypes) => {
    toggleDarkMode(mode);
  };

  switch (modeType) {
    case DarkModeTypes.ON:
      return (
        <button onClick={() => handleMode(DarkModeTypes.OFF)}>
          <CustomIcon
            className="pl-4 h-6 cursor-pointer"
            icon={IconTypes.Moon}
            color={Theme.colors.accent}
          />
        </button>
      );
    case DarkModeTypes.OFF:
      return (
        <button onClick={() => handleMode(DarkModeTypes.SYSTEM)}>
          <CustomIcon
            className="pl-4 h-6 cursor-pointer"
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
              className="pl-4 h-6 cursor-pointer"
              icon={IconTypes.Moon}
              color={'grey'}
            />
          </button>
        );
      }
      return (
        <button onClick={() => handleMode(DarkModeTypes.ON)}>
          <CustomIcon
            className="pl-4 h-6 cursor-pointer"
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
  constructor(props: NavBarProps) {
    super(props);
    this.state = {
      darkModeType: getDarkModeType(),
      isDark: isDarkMode()
    };
  }

  public componentDidMount() {
    emitter.on('darkMode', (change: DarkModeChangeEvent) => {
      this.setState({
        isDark: change.isDarkMode,
        darkModeType: change.darkModeType
      });
    });
  }

  public render() {
    console.log(window.location.href);

    const darkModeType = this.state.darkModeType;
    const isDark = this.state.isDark;

    return (
      <nav className="flex flex-row">
        <div className="nav-padding basis-4/5"></div>
        <div className="nav-section basis-1/5">
          <div className="flex flex-row p-4">
            <div className="flex-grow"></div>

            <div className="pl-2 pr-4">
              <Link to={'/'}>
                <CustomIcon icon={IconTypes.Home} />
              </Link>
            </div>
            <div className="pr-2">
              <Link to={'/Login'}>
                <CustomIcon icon={IconTypes.UserCircle} />
              </Link>
            </div>
            <a
              href="https://github.com/William-Olson/olson-studio-www"
              target="_blank"
              rel="noopener"
              aria-label={'Github Link'}
              className="pl-2 h-6 cursor-pointer"
            >
              <CustomIcon icon={IconTypes.Github} />
            </a>
            {getToggleIcon(isDark, darkModeType)}
          </div>
        </div>
      </nav>
    );
  }
}