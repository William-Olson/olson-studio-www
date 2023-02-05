import axios, { AxiosResponse } from 'axios';
import jwtDecode from 'jwt-decode';
import { singleton, inject, injectable } from 'tsyringe';
import config from '../../config/google';
import Badge, { BadgeTypes } from '../data/models/Badge';
import User from '../data/models/User';
import LoggerFactory, { Logger } from './Logger';

export interface GoogleUser {
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

@singleton()
@injectable()
export class GoogleService {
  private logger: Logger;

  constructor(@inject(LoggerFactory) loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.getLogger(`app:services:${GoogleService.name}`);
  }

  /*
    Exchanges an authorization code for an access token and user profile information
  */
  public async exchangeAuthCodeForToken(code: string): Promise<GoogleUser> {
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

    // console.log('decodedJwt', JSON.stringify(decodedJwt));
    // console.log('fullGoogleUser', JSON.stringify(tokenResponse.data));

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

  /*
    Searches for Google user in the studio api database. Creates a new user if not found.
  */
  public async findOrCreateStudioUser(googleUser: GoogleUser): Promise<User> {
    this.logger.info('searching for user with sourceId ' + googleUser.googleId);
    let user = await User.findOne({
      where: {
        sourceId: googleUser.googleId
      },
      include: [
        {
          model: Badge,
          where: { type: BadgeTypes.Administrative },
          required: false
        }
      ]
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

    if (user.getRefreshToken() && googleUser.refreshToken) {
      this.logger.info(
        'updating refreshToken for user with sourceId' + googleUser.googleId
      );
    }

    // update user information to latest from provider
    user.setAuthToken(googleUser.accessToken);
    user.setRefreshToken(googleUser.refreshToken);
    user.avatar = googleUser.picture;
    await user.save();

    return user;
  }
}
