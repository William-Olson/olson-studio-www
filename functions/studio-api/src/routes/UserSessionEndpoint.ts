import { StatusCodes } from 'http-status-codes';
import { injectable } from 'tsyringe';
import Session from '../data/models/Session';
import { AuthRequest } from '../services/Auth';
import ErrorResponse from '../utilities/ErrorResponse';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';

@injectable()
export class UserSessionEndpoint extends BaseEndpoint implements RouterClass {
  public mountRoutes() {
    this.router.delete('/:sessionId', this.deleteCurrentSession.bind(this));
    this.router.get('/', this.getUserSessions.bind(this));
  }

  async getUserSessions(req: AuthRequest) {
    if (!req.session) {
      throw new ErrorResponse(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }

    const sessions = await Session.findAll({
      where: { userId: req.session.userId }
    });
    if (!sessions) {
      return { success: false };
    }
    return { success: true, results: sessions.map((s) => s.toJSON()) };
  }

  /**
   * Deletes a user session
   * @param req
   * @returns
   */
  async deleteCurrentSession(req: AuthRequest) {
    if (!req.session) {
      throw new ErrorResponse(StatusCodes.UNAUTHORIZED, 'Unauthorized');
    }

    if (!req.params.sessionId) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        'Missing session id url parameter'
      );
    }

    const session = await Session.findOne({
      where: { id: req.params.sessionId }
    });

    if (!session) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        'Unable to find session with id ' + req.params.sessionId
      );
    }

    if (req.session.userId !== session.userId) {
      throw new ErrorResponse(
        StatusCodes.UNPROCESSABLE_ENTITY,
        'Unable to delete session that is not owned by authenticated user'
      );
    }

    try {
      this.logger.info('Deleting session with id: ' + req.params.sessionId);
      await session.destroy();
      return { success: true, sessionId: req.params.sessionId };
    } catch (err) {
      this.logger.error(err);
      return { success: false };
    }
  }
}

export default UserSessionEndpoint;
