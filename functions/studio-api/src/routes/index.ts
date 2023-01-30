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
import BadgeEndpoint from './BadgeEndpoint';
import { BadgeNames } from '../data/models/Badge';
import AdminBadgesEndpoint from './admin/AdminBadgesEndpoint';
import ChoreChartsEndpoint from './admin/chores/ChoreChartsEndpoint';
import UsersEndpoint from './UsersEndpoint';
import ChoresEndpoint from './admin/chores/ChoresEndpoint';

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
    const auth: (
      required?: boolean,
      requiredBadges?: BadgeNames[]
    ) => RequestHandler = (required = true, requiredBadges = []) =>
      this.auth.getMiddleware(required, requiredBadges);

    const admin: () => RequestHandler = () => auth(true, [BadgeNames.Admin]);

    // const badges: (...badges: BadgeNames[]) => RequestHandler = (...badges) =>
    //   auth(true, [...badges]);

    return [
      // admin endpoints
      ['/admin/badges', [admin()], AdminBadgesEndpoint],
      ['/admin/chore-charts', [admin()], ChoresEndpoint],
      ['/admin/chore-charts', [admin()], ChoreChartsEndpoint],

      // using badge middleware
      // ['/some-endpoint', [badges(BadgeNames.Etc1, BadgeNames.Etc2)], SomeEndpoint],

      // auth'ed endpoints
      ['/test', [auth()], TestEndpoint],
      ['/me', [auth()], UserProfileEndpoint],
      ['/badges', [auth()], BadgeEndpoint],
      ['/sessions', [auth()], UserSessionEndpoint],
      ['/users', [auth()], UsersEndpoint],

      // optional auth endpoints
      ['/version', [auth(false)], VersionEndpoint],

      // no-auth endpoints
      ['/oauth2/redirect/google', [], GoogleAuthEndpoint],
      ['/', [], RootEndpoint]
    ];
  }
}
