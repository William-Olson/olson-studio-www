import {
  DbLayer,
  DbLayerFactory,
  DialectTypes,
  IDbAuthConfig
} from 'db-facade';
import { container, inject, singleton } from 'tsyringe';
import config from '../../config/database';
import LoggerFactory, { Logger } from '../services/Logger';
import { modelInitialization } from './init';
import { getMigrationFiles } from './migrations';

@singleton()
export class DataLayer {
  private db!: DbLayer;
  private dbConfig: IDbAuthConfig;
  private logger: Logger;

  constructor(@inject(LoggerFactory) loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.getLogger('app:db');
    this.dbConfig =
      process.env.NODE_ENV !== 'production' ? config.dev : config.prod;
  }

  private async connectAndRegisterDependency() {
    this.db = DbLayerFactory.newDbLayer({
      dialectType: DialectTypes.POSTGRES,
      databaseCredentials: this.dbConfig,
      migrationOptions: {
        migrations: await getMigrationFiles(),
        migrationTableName: 'app_migrations'
      }
    });

    this.logger.info('authenticating db . . .');
    await this.db.authenticate();
    this.logger.info('Success!');

    container.register<DbLayer>(DbLayer, { useValue: this.db });
  }

  public async init() {
    // connect & setup injection
    await this.connectAndRegisterDependency();

    // run the migrations
    await this.db.runMigrations();

    // init models
    await this.db.initialize(modelInitialization);
  }
}
