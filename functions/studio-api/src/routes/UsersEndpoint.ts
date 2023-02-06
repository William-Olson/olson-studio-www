import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import User from '../data/models/User';
import { AuthRequest } from '../services/Auth';
import LoggerFactory from '../services/Logger';
import { UserService } from '../services/UserService';
import ErrorResponse from '../utilities/ErrorResponse';
import { Paged, pagingFromRequest } from '../utilities/Pagination';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';

@injectable()
export class UsersEndpoint extends BaseEndpoint implements RouterClass {
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
    this.router.get('/', this.getUsers.bind(this));
  }

  async getUsers(req: AuthRequest) {
    const paging = pagingFromRequest(req);
    if (paging.errorMessage) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, paging.errorMessage);
    }

    // fetch users and restrict the fields returned
    const users = await this.userService.getUsers();
    const result: Paged<Partial<User>> = Object.assign({}, users, {
      results: users.results.map((u) =>
        _.pick(u, ['id', 'firstName', 'lastName', 'email', 'avatar'])
      )
    });

    return result;
  }
}

export default UsersEndpoint;
