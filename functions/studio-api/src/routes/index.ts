import { inject, injectable, singleton } from 'tsyringe';
import LoggerFactory, { Logger } from '../services/Logger';
import { AuthService } from '../services/Auth';
import { RequestHandler } from 'express';
import { VersionEndpoint } from './VersionEndpoint';
import { TestEndpoint } from './TestEndpoint';
import { RootEndpoint } from './RootEndpoint';
import { GoogleAuthEndpoint } from './GoogleAuthEndpoint';
import { UserProfileEndpoint } from './UserProfileEndpoint';
import UserSessionEndpoint from './UserSessionEndpoint';

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
    const auth: (required?: boolean) => RequestHandler = (required = true) =>
      this.auth.getMiddleware(required);

    return [
      // auth'ed endpoints
      ['/test', [auth()], TestEndpoint],
      ['/me', [auth()], UserProfileEndpoint],
      ['/sessions', [auth()], UserSessionEndpoint],

      // optional auth endpoints
      ['/version', [auth(false)], VersionEndpoint],

      // no-auth endpoints
      ['/oauth2/redirect/google', [], GoogleAuthEndpoint],
      ['/', [], RootEndpoint]
    ];
  }
}
