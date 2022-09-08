import { NextFunction, RequestHandler, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable, singleton } from 'tsyringe';
import Badge, { BadgeNames } from '../data/models/Badge';
import User from '../data/models/User';
import { AuthRequest, AuthService } from './Auth';
import LoggerFactory, { Logger } from './Logger';

/*
  BadgeService
  Provides functionality and operations around App and User Badges.
*/
@singleton()
export class BadgeService {
  private logger: Logger;
  private auth: AuthService;

  constructor(
    @inject(LoggerFactory) loggerFactory: LoggerFactory,
    @inject(AuthService) auth: AuthService
  ) {
    this.logger = loggerFactory.getLogger(`app:services:${BadgeService.name}`);
    this.auth = auth;
  }

  public getMiddleware(requiredBadges: BadgeNames[]): RequestHandler {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
      try {
        this.logger.info('req.session: ' + req.session);
        this.logger.info('req.user: ' + req.user);
        if (!req.session || !req.user) {
          this.logger.error('Not Authorized! No User Session!');
          res.statusCode = StatusCodes.UNAUTHORIZED;
          res.send({
            message: 'Unauthorized',
            statusCode: StatusCodes.UNAUTHORIZED
          });
          return;
        }

        if (!(await this.auth.userHasAccessBadges(req, res, requiredBadges))) {
          return;
        }

        next();
      } catch (err) {
        return next(err);
      }
    };
  }

  public async getUserBadges(userId: number): Promise<Badge[]> {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('Unable to resolve user from user id: ' + userId);
    }
    return (await user?.getBadges()) || []; // eslint-disable-line
  }

  public async getBadge(name: string): Promise<Badge | undefined> {
    const badge = await Badge.findOne({ where: { name } });
    return badge || undefined;
  }

  public async getBadges(): Promise<{ rows: Badge[]; count: number }> {
    return await Badge.findAndCountAll();
  }
}
