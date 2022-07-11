import { Request } from 'express';
import { inject, injectable } from 'tsyringe';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';
import { UserOutput } from '../data/models/User';
import { AuthService } from '../services/Auth';
import { HarnessDependency } from 'route-harness';
import LoggerFactory from '../services/Logger';
import { GoogleService } from '../services/Google';

interface PostGoogleAuthResponse {
  success: boolean;
  user?: UserOutput;
  token?: string;
  error?: string;
}

@injectable()
export class GoogleAuthEndpoint extends BaseEndpoint implements RouterClass {
  private authService: AuthService;
  private googleService: GoogleService;

  constructor(
    @inject('RouteHarness') harness: HarnessDependency,
    @inject(LoggerFactory) loggerFactory: LoggerFactory,
    @inject(AuthService) auth: AuthService,
    @inject(GoogleService) google: GoogleService
  ) {
    super(harness, loggerFactory);
    this.authService = auth;
    this.googleService = google;
  }

  mountRoutes() {
    this.postGoogleAuth = this.postGoogleAuth.bind(this);
    this.router.post('/', this.postGoogleAuth);
  }

  async postGoogleAuth(request: Request): Promise<PostGoogleAuthResponse> {
    try {
      const googleUser = await this.googleService.exchangeAuthCodeForToken(
        request.body.code
      );

      // create or find user
      const studioUser = await this.googleService.findOrCreateStudioUser(
        googleUser
      );

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
}

export default GoogleAuthEndpoint;
