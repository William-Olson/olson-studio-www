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
  }

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

    if (req.session.id !== req.params.sessionId) {
      throw new ErrorResponse(
        StatusCodes.UNPROCESSABLE_ENTITY,
        'Unable to delete session that is not the current session'
      );
    }

    this.logger.info('Deleting session with id: ' + req.params.sessionId);

    const session = await Session.findOne({
      where: { id: req.params.sessionId }
    });
    if (!session) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        'Unable to find session with id ' + req.params.sessionId
      );
    }

    await session.destroy();

    return { success: true, sessionId: req.params.sessionId };
  }
}

export default UserSessionEndpoint;
