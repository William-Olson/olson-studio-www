import { VersionEndpoint } from './VersionEndpoint';
import { TestEndpoint } from './TestEndpoint';
import { RootEndpoint } from './RootEndpoint';
import GoogleAuthEndpoint from './GoogleAuthEndpoint';
import { inject, injectable, singleton } from 'tsyringe';
import LoggerFactory, { Logger } from '../services/Logger';
import { AuthService } from '../services/Auth';
import { RequestHandler } from 'express';
import { UserProfileEndpoint } from './UserProfileEndpoint';

@singleton()
@injectable()
export class ApiRoutes {
  logger: Logger;
  auth: AuthService;
  constructor(
    @inject(LoggerFactory) loggerFactory: LoggerFactory,
    @inject(AuthService) authService: AuthService
  ) {
    this.logger = loggerFactory.getLogger(`app:${ApiRoutes.name}`);
    this.auth = authService;
  }

  getRoutes(): [string, RequestHandler[], unknown][] {
    const auth: () => RequestHandler = () => this.auth.getMiddleware();
    return [
      // auth'ed endpoints
      ['/test', [auth()], TestEndpoint],
      ['/me', [auth()], UserProfileEndpoint],

      // no-auth endpoints
      ['/version', [], VersionEndpoint],
      ['/oauth2/redirect/google', [], GoogleAuthEndpoint],
      ['/', [], RootEndpoint]
    ];
  }
}
