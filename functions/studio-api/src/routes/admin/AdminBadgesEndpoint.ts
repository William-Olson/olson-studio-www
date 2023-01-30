import { StatusCodes } from 'http-status-codes';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import { AdminRequest } from '../../services/Auth';
import LoggerFactory from '../../services/Logger';
import { BadgeService } from '../../services/BadgeService';
import ErrorResponse from '../../utilities/ErrorResponse';
import { RouterClass } from './../BaseEndpoint';
import AdminEndpoint, { isAdminRequest } from './AdminEndpoint';
import { pagingFromRequest } from '../../utilities/Pagination';

@injectable()
export class AdminBadgesEndpoint extends AdminEndpoint implements RouterClass {
  private badgeService: BadgeService;

  constructor(
    @inject('RouteHarness') harness: HarnessDependency,
    @inject(LoggerFactory) loggerFactory: LoggerFactory,
    @inject(BadgeService) badgeService: BadgeService
  ) {
    super(harness, loggerFactory);
    this.badgeService = badgeService;
  }

  public mountRoutes() {
    this.router.get('/:type', this.getBadgeByType.bind(this));
    this.router.get('/', this.getBadges.bind(this));
  }

  async getBadges(req: AdminRequest) {
    this.logger.info('fetching all badges');
    const paging = pagingFromRequest(req);
    if (paging.errorMessage) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, paging.errorMessage);
    }
    return await this.badgeService.getBadges(paging);
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
