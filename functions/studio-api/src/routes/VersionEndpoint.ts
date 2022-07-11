import { DbLayer } from 'db-facade';
import { container, injectable } from 'tsyringe';
import packageJson from '../../../../package.json';
import { AuthRequest } from '../services/Auth';
import { BaseEndpoint, RouterClass } from './BaseEndpoint';

interface VersionResponse {
  app: string;
  db?: string;
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

  public async getVersion(req: AuthRequest): Promise<VersionResponse> {
    this.logger.info(
      `returning version ${packageJson.version} for endpoint response`
    );
    let dbVersion: string | undefined;
    try {
      if (req.user) {
        const db = container.resolve(DbLayer);
        dbVersion = await db.getDbVersion();
      }
    } catch (_) {
      this.logger.error('Unable to get version from database');
    }
    const resp: VersionResponse = {
      app: packageJson.version
    };
    if (dbVersion) {
      resp.db = dbVersion;
    }
    return resp;
  }
}
