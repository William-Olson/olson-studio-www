import { Request } from 'express';
import { injectable } from 'tsyringe';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';

@injectable()
export class GoogleAuthEndpoint extends BaseEndpoint implements RouterClass {
  mountRoutes() {
    this.postGoogleAuth = this.postGoogleAuth.bind(this);
    this.router.post('/', this.postGoogleAuth);
  }

  postGoogleAuth(request: Request) {
    this.logger.info('Post Google Authentication!');
    // TODO
    this.logger.info('code: ' + request.body.code);
    this.logger.info(JSON.stringify(request.body, null, 2));
    return { success: true };
  }
}

export default GoogleAuthEndpoint;
