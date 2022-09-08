import { StatusCodes } from 'http-status-codes';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import { AuthRequest } from '../services/Auth';
import LoggerFactory from '../services/Logger';
import { BadgeService } from '../services/BadgeService';
import ErrorResponse from '../utilities/ErrorResponse';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';

@injectable()
export class BadgeEndpoint extends BaseEndpoint implements RouterClass {
  private badgeService: BadgeService;

  constructor(
    @inject('RouteHarness') harness: HarnessDependency,
    @inject(LoggerFactory) loggerFactory: LoggerFactory,
    @inject(BadgeService) BadgeService: BadgeService
  ) {
    super(harness, loggerFactory);
    this.badgeService = BadgeService;
  }

  public mountRoutes() {
    this.router.get('/', this.getBadges.bind(this));
  }

  async getBadges(req: AuthRequest) {
    if (!req.user) {
      throw new ErrorResponse(
        StatusCodes.UNAUTHORIZED,
        'Request is missing user session data!'
      );
    }

    try {
      // fetch user from db
      const badges = await this.badgeService.getUserBadges(req.user.id);

      if (!badges || !badges.length) {
        return [];
      }

      return badges.map((b) => b.toJSON());
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }
}

export default BadgeEndpoint;
