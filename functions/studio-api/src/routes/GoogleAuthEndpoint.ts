import { Request } from 'express';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import LoggerFactory, { Logger } from '../services/Logger';

@injectable()
export class GoogleAuthEndpoint {
  logger: Logger;
  constructor(
    @inject('HarnessDependency') harness: HarnessDependency,
    @inject(LoggerFactory) loggerFactory: LoggerFactory
  ) {
    this.logger = loggerFactory.getLogger('app:route:google-auth-endpoint');
    const router: HarnessDependency = harness.getRouterForClass(
      GoogleAuthEndpoint.name
    );

    this.postGoogleAuth = this.postGoogleAuth.bind(this);
    router.post('/', this.postGoogleAuth);
  }

  postGoogleAuth(request: Request) {
    this.logger.info('Post Google Authentication!');
    // TODO
    console.dir(request.body);
    return { success: true };
  }
}

export default GoogleAuthEndpoint;
