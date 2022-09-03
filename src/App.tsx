import { ReactElement } from 'react';
import { Outlet } from 'react-router-dom';
import { DarkModeComponent } from './components/helpers/DarkModeComponent';
import { Footer } from './components/layout/Footer';
import { NavBar } from './components/layout/nav/NavBar';
import { emitter, UserInfoEvent } from './Events';
import { getToken, removeToken, Token } from './util/Auth';
import { getToastTheme, Toast } from './util/Toast';
import { StudioApiService } from './services/StudioApiService';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class App extends DarkModeComponent {
  private service: StudioApiService = new StudioApiService();
  componentDidMount() {
    // handle super class behaviour since we override the mount method
    emitter.on('darkMode', this.handleDarkModeChange);

    // check for token and fetch userInfo if found
    const token: Token = getToken();
    if (token.isValid()) {
      Toast.showProgress(
        async () => {
          try {
            const user = await this.service.getUserInfo(token);
            const ev: UserInfoEvent = { user };
            emitter.emit('userInfo', ev);
          } catch (err) {
            console.error('Error fetching user: ', err);
            removeToken();
            throw err;
          }
        },
        {
          pending: 'Authenticating ☝ ... ',
          success: 'Welcome Back! 👋 ',
          error: 'Bad Auth Token! 😬'
        },
        {
          theme: getToastTheme(this.state.isDark)
        }
      );
    }
  }
  public render(): ReactElement {
    return (
      <div className="w-full h-full">
        <ToastContainer />
        <div className="md:w-90 max-w-90 h-56px">
          <NavBar />
        </div>
        <div className="content-wrapper">
          <Outlet />
        </div>
        <div className="footer md:w-full max-w-full text-center p-36px h-24px">
          <Footer />
        </div>
      </div>
    );
  }
}

export default App;
