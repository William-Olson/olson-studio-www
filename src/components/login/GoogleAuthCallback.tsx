import React from 'react';
import { StudioApiService } from '../../services/StudioApiService';

export class GoogleAuthCallback extends React.Component {
  private service = new StudioApiService();

  public async loginWithGoogle(code: string, toPage = '/') {
    console.log('exchanging auth code ' + code + ' for access token...');
    const resp = await this.service.exchangeGoogleAuthToken(code);
    console.log('Response from token exchange: ' + resp);
    if (resp && resp.accessToken) {
      // TODO: add session info to localStorage
      this.context.router.transitionTo(toPage);
    }
  }

  public render() {
    const queryParams = new URLSearchParams(window.location.search);

    // send code to backend to exchange for access token and user data
    if (queryParams.has('code')) {
      const code = queryParams.get('code') || '';
      const state = queryParams.get('state');
      console.log('state param: ' + state);
      this.loginWithGoogle(code);
    }

    return (
      <div className="mr-auto ml-auto w-full text-center">
        <div>Connecting with Google...</div>
      </div>
    );
  }
}
