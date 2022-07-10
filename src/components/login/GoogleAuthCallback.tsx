import React from 'react';
import { emitter, LoginEvent } from '../../Events';
import { StudioApiService } from '../../services/StudioApiService';
import { getToken, removeToken, setToken } from '../../util/Auth';
import { isDarkMode } from '../../util/DarkMode';
import { getToastTheme, Toast } from '../../util/Toast';
import { WillNavigate } from '../helpers/WillNavigate';

interface GoogleAuthCallbackProps {}
interface GoogleAuthCallbackState {
  loading: boolean;
}

export class GoogleAuthCallback extends React.Component<
  GoogleAuthCallbackProps,
  GoogleAuthCallbackState
> {
  private service = new StudioApiService();

  constructor(props: GoogleAuthCallbackProps) {
    super(props);
    this.loginWithGoogle = this.loginWithGoogle.bind(this);
    this.state = { loading: false };
  }

  public async loginWithGoogle(code: string, toPage = '/') {
    if (this.state.loading) {
      return;
    }
    // console.log(`exchanging auth code ${code} for access token...`);
    this.setState({ loading: true });
    try {
      if (getToken()) {
        // TODO: send delete requrest to delete old session?
        removeToken();
      }
      const resp = await this.service.exchangeGoogleAuthToken(code);

      if (resp && resp.success && resp.user) {
        // console.log('got user from token exchange: ', resp.user);
        setToken(resp.token);
        const ev: LoginEvent = { user: resp.user, token: resp.token };
        emitter.emit('userLogin', ev);
        emitter.emit('shouldNavigate', { location: toPage });
      } else {
        throw new Error('Error logging in user');
      }
    } catch (err) {
      console.error('Error logging in user: ', err);
      throw err;
    }
  }

  public componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);

    // send code to backend to exchange for access token and user data
    if (queryParams.has('code') && !this.state.loading) {
      const code = queryParams.get('code') || '';
      const state = queryParams.get('state');
      console.log('state param: ' + state);
      Toast.showProgress(
        () => this.loginWithGoogle(code),
        {
          pending: 'Logging You In... ',
          success: 'Login Successful! 👋 ',
          error: 'Uh Oh, An Unexpected Error Occurred! Unable to login! 😭'
        },
        {
          theme: getToastTheme(isDarkMode())
        }
      );
    }
  }

  public render() {
    return (
      <div className="mr-auto ml-auto w-full text-center">
        <WillNavigate />
        <div>Connecting with Google...</div>
      </div>
    );
  }
}
