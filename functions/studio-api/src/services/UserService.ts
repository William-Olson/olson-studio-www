import { Includeable } from 'sequelize/types';
import { inject, singleton } from 'tsyringe';
import Badge, { BadgeTypes } from '../data/models/Badge';
import User, { UserOutput } from '../data/models/User';
import {
  asOffset,
  asPagedResponse,
  Paged,
  PagingOptions
} from '../utilities/Pagination';
import LoggerFactory, { Logger } from './Logger';

export const AccessBadges: Includeable = {
  required: false,
  model: Badge,
  where: {
    type: BadgeTypes.Administrative
  }
};

/*
  UserService
  Provides functionality and operations around App and User Badges.
*/
@singleton()
export class UserService {
  private logger: Logger;

  constructor(@inject(LoggerFactory) loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.getLogger(`app:services:${UserService.name}`);
  }

  public async getUsers(paging?: PagingOptions): Promise<Paged<UserOutput>> {
    this.logger.info('Fetching users...');
    const offsetPaging = asOffset(paging);

    return asPagedResponse(
      await User.findAndCountAll({
        limit: offsetPaging.limit,
        offset: offsetPaging.offset
      }),
      offsetPaging
    );
  }

  public async getBySourceId(userSourceId: string): Promise<User | undefined> {
    const user = await User.findOne({
      where: { sourceId: userSourceId },
      include: [AccessBadges]
    });

    return user || undefined;
  }

  public async getById(userId: number): Promise<User | undefined> {
    const user = await User.findOne({
      where: { id: userId },
      include: [AccessBadges]
    });

    return user || undefined;
  }

  public async getUserProfile(userId: number): Promise<User | undefined> {
    const user = await User.findOne({
      where: { id: userId },
      include: [Badge]
    });

    return user || undefined;
  }
}
