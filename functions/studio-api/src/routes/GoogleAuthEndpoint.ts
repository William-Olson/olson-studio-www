import axios, { AxiosResponse } from 'axios';
import { Request } from 'express';
import config from '../../config/google';
import { inject, injectable } from 'tsyringe';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';
import jwtDecode from 'jwt-decode';
import User, { UserOutput } from '../data/models/User';
import { AuthService } from '../services/Auth';
import { HarnessDependency } from 'route-harness';
import LoggerFactory from '../services/Logger';

interface GoogleAuthResponse {
  id_token: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

interface GoogleJwt {
  sub: string;
  email: string;
  name: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

interface GoogleUser {
  googleId: string;
  accessToken: string;
  refreshToken: string;
  authExpiration: number;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  picture?: string;
}

interface PostGoogleAuthResponse {
  success: boolean;
  user?: UserOutput;
  token?: string;
  error?: string;
}

@injectable()
export class GoogleAuthEndpoint extends BaseEndpoint implements RouterClass {
  private authService: AuthService;
  constructor(
    @inject('RouteHarness') harness: HarnessDependency,
    @inject(LoggerFactory) loggerFactory: LoggerFactory,
    @inject(AuthService) auth: AuthService
  ) {
    super(harness, loggerFactory);
    this.authService = auth;
  }

  mountRoutes() {
    this.postGoogleAuth = this.postGoogleAuth.bind(this);
    this.router.post('/', this.postGoogleAuth);
  }

  async postGoogleAuth(request: Request): Promise<PostGoogleAuthResponse> {
    try {
      const googleUser = await this.exchangeAuthCodeForToken(request.body.code);

      // create or find user
      const studioUser = await this.findOrCreateUser(googleUser);

      // create new session for user
      const sessionData = await this.authService.createSession(
        studioUser,
        request
      );

      return {
        success: true,
        user: studioUser.toJSON(),
        token: sessionData.token
      };
    } catch (err) {
      console.error(err);
      return { success: false, error: (err as Error)?.message };
    }
  }

  private async findOrCreateUser(googleUser: GoogleUser): Promise<User> {
    this.logger.info('searching for user with sourceId ' + googleUser.googleId);
    let user = await User.findOne({
      where: {
        sourceId: googleUser.googleId
      }
    });

    if (!user) {
      this.logger.info('user not found with sourceID ' + googleUser.googleId);
      // create user
      user = await User.create(
        {
          firstName: googleUser.firstName,
          lastName: googleUser.lastName,
          email: googleUser.email,
          provider: 'google',
          sourceId: googleUser.googleId
        },
        { isNewRecord: true }
      );
    }

    // update auth & avatar picture
    this.logger.info(
      'updating auth for user with sourceId' + googleUser.googleId
    );
    this.logger.info('replacing auth token:  ' + user.getAuthToken());
    this.logger.info('with new auth token:  ' + googleUser.accessToken);
    user.setAuthToken(googleUser.accessToken);
    user.setRefreshToken(googleUser.refreshToken);
    user.avatar = googleUser.picture;
    await user.save();

    return user;
  }

  private async exchangeAuthCodeForToken(code: string): Promise<GoogleUser> {
    const tokenResponse: AxiosResponse<GoogleAuthResponse> =
      await axios.request({
        url: config.server.tokenUri,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        data: {
          code,
          grant_type: 'authorization_code',
          scope: 'email openid profile',
          client_id: config.server.clientId,
          client_secret: config.server.clientSecret,
          redirect_uri: config.server.redirectUri
        }
      });

    const decodedJwt: GoogleJwt = jwtDecode(tokenResponse.data.id_token);

    console.log('decodedJwt', JSON.stringify(decodedJwt));
    console.log('fullGoogleUser', JSON.stringify(tokenResponse.data));

    return {
      googleId: decodedJwt.sub,
      accessToken: tokenResponse.data.access_token,
      refreshToken: tokenResponse.data.refresh_token,
      authExpiration: new Date().getTime() + tokenResponse.data.expires_in,
      email: decodedJwt.email,
      name: decodedJwt.name,
      firstName: decodedJwt.given_name,
      lastName: decodedJwt.family_name,
      picture: decodedJwt.picture
    } as GoogleUser;
  }
}

export default GoogleAuthEndpoint;
