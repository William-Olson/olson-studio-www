import { StatusCodes } from 'http-status-codes';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import { AuthRequest } from '../services/Auth';
import LoggerFactory from '../services/Logger';
import { UserService } from '../services/UserService';
import ErrorResponse from '../utilities/ErrorResponse';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';

@injectable()
export class UserProfileEndpoint extends BaseEndpoint implements RouterClass {
  private userService: UserService;

  constructor(
    @inject('RouteHarness') harness: HarnessDependency,
    @inject(LoggerFactory) loggerFactory: LoggerFactory,
    @inject(UserService) userService: UserService
  ) {
    super(harness, loggerFactory);
    this.userService = userService;
  }

  public mountRoutes() {
    this.router.get('/', this.getUserProfile.bind(this));
  }

  async getUserProfile(req: AuthRequest) {
    if (!req.user) {
      throw new ErrorResponse(
        StatusCodes.UNAUTHORIZED,
        'Request is missing user session data!'
      );
    }

    // fetch user from db with all their associated data
    const profile = await this.userService.getUserProfile(req.user?.id);

    if (!profile) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        'Unable to find user with id: ' + req.user?.id
      );
    }
    return profile.toJSON();
  }
}

export default UserProfileEndpoint;
