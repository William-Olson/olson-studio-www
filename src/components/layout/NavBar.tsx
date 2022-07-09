import { Link } from 'react-router-dom';
import { emitter, LoginEvent } from '../../Events';
import { IconTypes } from '../../types/AppTypes';
import { CustomIcon } from '../CustomIcon';
import {
  DarkModeComponent,
  DarkModeComponentState
} from '../helpers/DarkModeComponent';
import { getToggleIcon } from '../helpers/DarkModeToggle';

interface NavBarProps {}
interface NavBarState extends DarkModeComponentState {
  user?: { avatar?: string };
}

export class NavBar extends DarkModeComponent<NavBarProps, NavBarState> {
  constructor(props: NavBarProps) {
    super(props);
    this.handleLogin = this.handleLogin.bind(this);
  }

  handleLogin(event: LoginEvent) {
    this.setState({
      user: { avatar: event.user?.avatar }
    });
  }

  public componentDidMount(): void {
    emitter.on('userLogin', this.handleLogin);
    emitter.on('darkMode', this.handleDarkModeChange);
  }

  public componentWillUnmount() {
    emitter.off('userLogin', this.handleLogin);
    emitter.off('darkMode', this.handleDarkModeChange);
  }

  public render() {
    const darkModeType = this.state.darkModeType;
    const isDark = this.state.isDark === true;

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
            {!this.state.user?.avatar && (
              <div className="pr-2">
                <Link to={'/Login'}>
                  <CustomIcon icon={IconTypes.UserCircle} />
                </Link>
              </div>
            )}
            {!!this.state.user?.avatar && (
              <div className="pr-2">
                <Link to={'/Login'}>
                  <img src={this.state.user.avatar} alt="user avatar" />
                </Link>
              </div>
            )}
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
