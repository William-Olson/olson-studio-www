import { injectable } from 'tsyringe';
import packageJson from '../../../../package.json';
import { BaseEndpoint, RouterClass } from './BaseEndpoint';

interface VersionResponse {
  app: string;
}

@injectable()
export class VersionEndpoint extends BaseEndpoint implements RouterClass {
  // private db: DbLayer;
  // constructor(
  //   @inject('RouteHarness') harness: HarnessDependency,
  //   @inject(LoggerFactory) loggerFactory: LoggerFactory,
  //   @inject(DbLayer) db: DbLayer
  // ) {
  //   super(harness, loggerFactory);
  //   this.db = db;
  // }

  public mountRoutes() {
    this.router.get('/', this.getVersion.bind(this));
  }

  public getVersion(): VersionResponse {
    this.logger.info(
      `returning version ${packageJson.version} for endpoint response`
    );
    return {
      app: packageJson.version
    };
  }
}
