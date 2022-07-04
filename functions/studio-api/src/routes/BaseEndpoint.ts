import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import LoggerFactory, { Logger } from '../services/Logger';

export interface RouterClass {
  mountRoutes(): void;
}

@injectable()
export class BaseEndpoint {
  public logger: Logger;
  public router: HarnessDependency;

  constructor(
    @inject('RouteHarness') harness: HarnessDependency,
    @inject(LoggerFactory) loggerFactory: LoggerFactory
  ) {
    this.logger = loggerFactory.getLogger(`app:route:${this.constructor.name}`);
    this.router = harness.getRouterForClass(this.constructor.name);

    this.mountRoutes();
  }

  mountRoutes(): void {
    throw new Error(
      `mountRoutes not implemented in route subclass ${this.constructor.name}`
    );
  }
}

export default BaseEndpoint;
