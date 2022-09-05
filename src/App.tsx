import React, { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { Footer } from './components/layout/Footer';
import { NavBar } from './components/layout/nav/NavBar';
import { emitter, UserInfoEvent } from './Events';
import { Token } from './util/Auth';
import { observer, Provider } from 'mobx-react';
import { getToastTheme, Toast } from './util/Toast';
import { StudioApiService } from './services/StudioApiService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { DarkModeState } from './stores/DarkModeStore';
import { UserState } from './stores/UserStore';

class App extends React.Component {
  private service: StudioApiService = new StudioApiService();
  private darkMode: typeof DarkModeState = DarkModeState;
  private user: typeof UserState = UserState;

  componentDidMount() {
    this.darkMode.loadDarkModeFromCache();
    console.log('loaded dark mode from cache');
    // check for token and fetch userInfo if found
    const token: Token = Token.fromCache();
    if (token.isValid()) {
      Toast.showProgress(
        async () => {
          try {
            const user = await this.service.getUserInfo(token);
            const ev: UserInfoEvent = { user };
            emitter.emit('userInfo', ev);
          } catch (err) {
            console.error('Error fetching user: ', err);
            Token.clearCache();
            throw err;
          }
        },
        {
          pending: 'Authenticating ☝ ... ',
          success: 'Welcome Back! 👋 ',
          error: 'Bad Auth Token! 😬'
        },
        {
          theme: getToastTheme(this.darkMode.isDark)
        }
      );
    }
  }

  public render(): ReactElement {
    return (
      <Provider darkMode={this.darkMode} user={this.user}>
        <div className="w-full h-full">
          <ToastContainer />
          <div className="md:w-90 max-w-90 h-56px">
            <NavBar darkMode={this.darkMode} user={this.user} />
          </div>
          <div className="content-wrapper">
            <Outlet />
          </div>
          <div className="footer md:w-full max-w-full text-center p-36px h-24px">
            <Footer />
          </div>
        </div>
      </Provider>
    );
  }
}

export default observer(App);
