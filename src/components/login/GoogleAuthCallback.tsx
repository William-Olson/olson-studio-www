import React from 'react';
import { emitter } from '../../Events';
import { StudioApiService } from '../../services/StudioApiService';
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
    console.log('exchanging auth code ' + code + ' for access token...');
    this.setState({ loading: true });
    const resp = await this.service.exchangeGoogleAuthToken(code);

    if (resp && resp.success && resp.user) {
      console.log('got user from token exchange: ', resp.user);
      localStorage.setItem('token', resp.token);
      emitter.emit('userLogin', { user: resp.user, token: resp.token });
      emitter.emit('shouldNavigate', { location: toPage });
    } else {
      // TODO: handle error
      console.error('Error logging in user');
    }
  }

  public componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);

    // send code to backend to exchange for access token and user data
    if (queryParams.has('code') && !this.state.loading) {
      const code = queryParams.get('code') || '';
      const state = queryParams.get('state');
      console.log('state param: ' + state);
      this.loginWithGoogle(code);
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
