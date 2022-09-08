import { NextFunction, Request, RequestHandler, Response } from 'express';
import { inject, injectable, singleton } from 'tsyringe';
import LoggerFactory, { Logger } from './Logger';
import config from '../../config/server';
import jwt from 'jsonwebtoken';
import User from '../data/models/User';
import { hashPassword, verifyPassword } from '../utilities/HashUtil';
import Session from '../data/models/Session';
import { v4 as uuidv4 } from 'uuid';
import { UserService } from './UserService';
import Badge, { BadgeNames } from '../data/models/Badge';
import { StatusCodes } from 'http-status-codes';

const TEN_YEARS = 60 * 60 * 24 * 365.25 * 10;
const SESSION_TOKEN_EXPIRES = TEN_YEARS;

export interface AuthRequest extends Request {
  session?: Session | null;
  user?: User | null;
}

export interface AdminRequest extends Required<AuthRequest> {}

export interface SessionData {
  session: Session;
  token: string;
}

interface ClaimData {
  sub?: string;
  secret: string;
  userId: number;
}

@injectable()
@singleton()
export class AuthService {
  private logger: Logger;
  private userService: UserService;
  constructor(
    @inject(LoggerFactory) loggerFactory: LoggerFactory,
    @inject(UserService) userService: UserService
  ) {
    this.logger = loggerFactory.getLogger(`app:${AuthService.name}`);
    this.userService = userService;
  }

  public getMiddleware(
    required = true,
    accessBadges: BadgeNames[] = []
  ): RequestHandler {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
      if (req.session) {
        next();
        return;
      }

      req.session = null;
      const header = req.headers['authorization'] || '';
      const match = header.match(/^(bearer|jwt) (.*)$/i);

      if (required && !match) {
        return this.badAuth(res, 'Not Authorized! No Token!');
      }

      if (match) {
        const [, , token] = match;
        const session = await this.getSession(token);

        if (required && !session) {
          return this.badAuth(res, 'Not Authorized! No Session!');
        } else if (!required && !session) {
          this.logger.info('Allowing user through as guest. (Auth Optional)');
        }

        if (session) {
          this.logger.info(`Authenticating user with id ${session?.userId}`);
          req.session = session;
          req.user = await this.userService.getById(session.userId);
          this.logger.info('added user to request: ' + req.user);
        }
      }

      // check access badges if passed in
      if (!!accessBadges && accessBadges.length > 0) {
        if (!req.session || !req.user) {
          const logMsg = 'Not Authorized! No User Session for Badge Check!';
          return this.badAuth(res, logMsg);
        }
        if (!this.userHasAccessBadges(req, res, accessBadges)) {
          return;
        }
      }

      next();
    };
  }

  /*
    Called from middleware to check if the user on the request has the
    required administrative badges. (expects user model with badges on
    request param). Sends 401s if any badges are not present and returns
    a value of false. Otherwise returns true if user has all badges.
   */
  public userHasAccessBadges(
    req: AuthRequest,
    res: Response,
    requiredBadges: BadgeNames[]
  ): boolean {
    if (!req.user?.Badges) {
      this.badAuth(
        res,
        `Not Authorized! User with id ${req.user?.id} has no access badges!`
      );
      return false;
    }

    const userBadges: Map<BadgeNames, Badge> = new Map(
      req.user.Badges.map((badge) => [badge.name as BadgeNames, badge])
    );
    for (const badgeName of requiredBadges) {
      if (!userBadges.has(badgeName)) {
        this.badAuth(
          res,
          `Not Authorized! Missing Required Badge: ${badgeName} ❌ `
        );
        return false;
      }
      this.logger.info(
        `Verified user with id ${req.user.id} has access badge: ${
          userBadges.get(badgeName)?.friendlyName
        } 🪪  ✨`
      );
    }
    return true;
  }

  private badAuth(res: Response, logMessage: string): void {
    this.logger.error(logMessage);
    res.statusCode = StatusCodes.UNAUTHORIZED;
    res.send({ message: 'Unauthorized', statusCode: StatusCodes.UNAUTHORIZED });
  }

  public async getSession(token: string): Promise<Session | null> {
    try {
      if (!config.jwtSecret) {
        throw new Error('Missing JWT secret environment variable');
      }

      // for now, not checking secret, just trusting signed token
      const decodedJwt: jwt.JwtPayload | string = jwt.verify(
        token,
        config.jwtSecret
      );

      if (typeof decodedJwt === 'string') {
        this.logger.info('DecodedJWT Payload as string:', decodedJwt);
        return null;
      }

      const numChars = 8;
      this.logger.info(
        `Looking for session with id ${decodedJwt.sub?.slice(0, numChars)}-**`
      );
      const session = await Session.findOne({
        where: { id: decodedJwt.sub }
      });

      if (!session) {
        this.logger.error(`Can't find session with id ${decodedJwt.sub}`);
        return null;
      }

      // verify that the session secret matches the hash
      try {
        const matches = await verifyPassword(
          {
            hash: session.hash,
            salt: session.salt,
            iterations: session.iterations
          },
          decodedJwt.secret
        );
        if (!matches) {
          this.logger.error('Session secret mismatch');
          return null;
        }
      } catch (hasherr) {
        this.logger.error('Error hashing secret in claim data: ', hasherr);
        // we've already verified the jwt and found the session
        // just assume that it matches and carry on
      }

      // if (decodedJwt.exp) {
      //   const d = new Date();
      //   const offset = 1000;
      //   d.setTime(decodedJwt.exp * offset);
      //   this.logger.info('Token expires ' + d.toISOString());
      // }

      // touch session
      await session.newActivity();

      return session;
    } catch (err) {
      this.logger.error('Error fetching session in auth manager: ', err);
      return null;
    }
  }

  public async getUserSessions(user: User): Promise<Session[]> {
    return await Session.findAll({
      where: { userId: user.id },
      attributes: { exclude: ['hash', 'salt', 'iterations'] }
    });
  }

  public async deleteAllUserSessions(user: User): Promise<void> {
    const sessions = await this.getUserSessions(user);
    for (const session of sessions) {
      await session.destroy();
    }
  }

  public async createSession(user: User, req: Request): Promise<SessionData> {
    // Pull out info from the http request
    let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (Array.isArray(clientIp)) {
      clientIp = clientIp.join('; ');
    }
    const userAgent = req.headers['user-agent'];

    // Generate pointer secret (encrypted val stored in db & un-encrypted
    // val attached to claims in token for checking against val in db)
    const ptSecret = uuidv4();
    const hashed = await hashPassword(ptSecret);

    const date = new Date();

    const session = await Session.create({
      id: uuidv4(),
      ...hashed,
      userId: user.id,
      clientIp,
      userAgent,
      lastActivity: date
    });

    const claims = { secret: ptSecret, userId: user.id };
    const token = this.createJwt(session.id, claims, SESSION_TOKEN_EXPIRES);

    return { session, token };
  }

  public async getUserFromSession(
    session: Session | null
  ): Promise<User | undefined> {
    if (!session) {
      return undefined;
    }
    return await this.userService.getById(session.userId);
  }

  private createJwt(sub: string, claims: ClaimData, expiresIn = 60 * 60) {
    if (!sub) {
      throw new Error('Missing parameter');
    }
    if (!config.jwtSecret) {
      throw new Error('Missing JWT secret environment variable');
    }

    if (claims.sub) {
      throw new Error('Cannot overwrite sub claim in claims parameter');
    }

    const options: jwt.SignOptions = { expiresIn };
    const payload: ClaimData = Object.assign({}, claims, {
      sub
    });

    return jwt.sign(payload, config.jwtSecret, options);
  }
}
