import React from 'react';
import { Link } from 'react-router-dom';
import { emitter, LoginEvent } from '../../../Events';
import { DarkModeState } from '../../../stores/DarkModeStore';
import { observer } from 'mobx-react';
import { UserState } from '../../../stores/UserStore';
import { IconTypes } from '../../../types/AppTypes';
import { CustomIcon } from '../../CustomIcon';
import { DarkModeToggle } from './DarkModeToggle';

interface NavBarProps {
  darkMode?: typeof DarkModeState;
  user?: typeof UserState;
}

class NavBarComponent extends React.Component<NavBarProps> {
  constructor(props: NavBarProps) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event: LoginEvent) {
    this.props.user?.setUser(event.user);
  }

  public componentDidMount(): void {
    emitter.on(['userLogin', 'userInfo'], this.handleLogin);
  }

  public componentWillUnmount() {
    emitter.off(['userLogin', 'userInfo'], this.handleLogin);
  }

  public render() {
    const adminBadge = !!this.props.user?.isAdmin;
    // console.log('isAdmin', adminBadge);

    return (
      <nav className="flex flex-row min-w-full">
        <div className="nav-padding basis-4/5"></div>
        <div className="nav-section basis-1/5">
          <div className="flex flex-row p-4">
            <div className="flex-grow"></div>
            <div className="pl-2 pr-4">
              <Link to={'/'}>
                <CustomIcon
                  darkMode={this.props.darkMode}
                  icon={IconTypes.Home}
                />
              </Link>
            </div>
            {!!this.props.user?.user && !!this.props.user?.isAdmin && (
              <div className="pr-2 ">
                <Link to={'/chore-charts'}>
                  <CustomIcon
                    darkMode={this.props.darkMode}
                    icon={IconTypes.Chart}
                  />
                </Link>
              </div>
            )}
            {!this.props.user?.user?.avatar && (
              <div className="pr-2 ">
                <Link to={'/Login'}>
                  <CustomIcon
                    darkMode={this.props.darkMode}
                    icon={IconTypes.UserCircle}
                  />
                </Link>
              </div>
            )}
            {!!this.props.user?.user?.avatar && (
              <div className="pr-2 min-w-6 w-8 h-8 ">
                <Link to={'/Profile'}>
                  <img
                    id="user-avatar"
                    className="inline object-cover w-6 h-6 rounded-full"
                    src={this.props.user?.user.avatar}
                    alt="user avatar"
                    referrerPolicy="no-referrer"
                  />
                </Link>
              </div>
            )}
            <a
              href="https://github.com/William-Olson/olson-studio-www"
              target="_blank"
              rel="noopener"
              aria-label={'Github Link'}
              className="pl-2 h-8 w-8 cursor-pointer"
            >
              <CustomIcon
                darkMode={this.props.darkMode}
                icon={IconTypes.Github}
              />
            </a>
            <DarkModeToggle darkMode={this.props.darkMode} />
          </div>
        </div>
      </nav>
    );
  }
}

export const NavBar = observer(NavBarComponent);
