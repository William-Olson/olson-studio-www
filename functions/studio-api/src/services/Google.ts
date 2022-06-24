import axios, { AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { singleton } from 'tsyringe';

interface GoogleAuthResponse {
  id_token: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface DecodedGoogleJwt {
  sub: string;
  email: string;
  name: string;
  given_name: string;
  family_name: number;
  picture: string;
}

import config from '../../config/google';

@singleton()
export class GoogleService {
  public async exchangeAuthCodeForToken(code: string) {
    try {
      const response: AxiosResponse = await axios.request({
        method: 'POST',
        url: config.server.tokenUri,
        headers: { 'Content-Type': 'application/json' },
        data: JSON.stringify({
          code,
          grant_type: 'authorization_code',
          scope: 'email openid profile',
          client_id: config.server.clientId,
          client_secret: config.server.clientSecret,
          redirect_uri: config.server.redirectUri
        })
      });
      const resp: GoogleAuthResponse = response.data as GoogleAuthResponse;

      const decodedJwt: DecodedGoogleJwt = jwtDecode(resp.id_token);

      return {
        googleId: decodedJwt.sub,
        auth: {
          accessToken: resp.access_token,
          refreshToken: resp.refresh_token,
          expiresAt: new Date().getTime() + resp.expires_in
        },
        email: decodedJwt.email,
        name: decodedJwt.name,
        firstName: decodedJwt.given_name,
        lastName: decodedJwt.family_name,
        picture: decodedJwt.picture
      };
    } catch (err) {
      console.error(err);
    }
  }
}
