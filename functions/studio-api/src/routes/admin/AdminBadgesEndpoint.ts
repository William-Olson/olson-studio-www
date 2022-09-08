import { StatusCodes } from 'http-status-codes';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import { AdminRequest } from '../../services/Auth';
import LoggerFactory from '../../services/Logger';
import { BadgeService } from '../../services/BadgeService';
import ErrorResponse from '../../utilities/ErrorResponse';
import { RouterClass } from './../BaseEndpoint';
import AdminEndpoint, { isAdminRequest } from './AdminEndpoint';

@injectable()
export class AdminBadgesEndpoint extends AdminEndpoint implements RouterClass {
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
    this.router.get('/:type', this.getBadgeByType.bind(this));
    this.router.get('/', this.getBadges.bind(this));
  }

  async getBadges(req: AdminRequest) {
    try {
      this.logger.info('fetching all badges');
      return await this.badgeService.getBadges();
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }

  async getBadgeByType(req: AdminRequest) {
    try {
      if (!isAdminRequest(req)) {
        throw new ErrorResponse(StatusCodes.UNAUTHORIZED, 'Unauthorized');
      }
      this.logger.info('searching for badge by type: ' + req.params.type);
      const result = await this.badgeService.getBadge(req.params.type);
      if (!result) {
        throw new ErrorResponse(
          StatusCodes.NOT_FOUND,
          'Unable to find badge with type ' + req.params.type
        );
      }
      return result;
    } catch (err) {
      this.logger.error(err);
      return [];
    }
  }
}

export default AdminBadgesEndpoint;
