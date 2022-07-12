import {
  DbLayer,
  DbLayerFactory,
  DialectTypes,
  IDbAuthConfig
} from 'db-facade';
import { Options } from 'sequelize';
import { container, inject, singleton } from 'tsyringe';
import config from '../../config/database';
import LoggerFactory, { Logger } from '../services/Logger';
import { modelInitialization } from './init';
import { getMigrationFiles } from './migrations';

// -- production configuration and helpers --------------------------------
type ProdDbConfig = { url: string };
function isProdConfig(
  prodConfig: ProdDbConfig | IDbAuthConfig
): prodConfig is ProdDbConfig {
  return !!(prodConfig as ProdDbConfig).url;
}
const PROD_DEFAULTS: Options = {
  logging: false
};
// ------------------------------------------------------------------------

@singleton()
export class DataLayer {
  private db!: DbLayer;
  private dbConfig: IDbAuthConfig | ProdDbConfig;
  private logger: Logger;

  constructor(@inject(LoggerFactory) loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.getLogger('app:db');
    this.logger.info(
      'setting DB_CONFIG via node environment: ' + process.env.NODE_ENV
    );
    this.dbConfig =
      process.env.NODE_ENV !== 'production' ? config.dev : config.prod;
  }

  private async defaultConnect() {
    this.logger.info('Connecting with dev credentials');
    this.db = DbLayerFactory.newDbLayer({
      dialectType: DialectTypes.POSTGRES,
      databaseCredentials: this.dbConfig as IDbAuthConfig,
      migrationOptions: {
        migrations: await getMigrationFiles(),
        migrationTableName: '~osdb_migrations'
      }
    });
  }

  private async prodConnect() {
    this.logger.info('Connecting with production credentials');
    const connectionString = (this.dbConfig as ProdDbConfig).url;
    const showFrom = 0;
    const showTo = 8;
    this.logger.info(
      'Connecting with url: ' +
        (connectionString || 'XXXXXXXX').slice(showFrom, showTo) +
        '**'
    );
    this.db = DbLayerFactory.newDbLayer({
      dbConnectionString: connectionString,
      sequelizeOptions: PROD_DEFAULTS,
      migrationOptions: {
        migrations: await getMigrationFiles(),
        migrationTableName: '~osdb_migrations'
      }
    });
  }

  private async connectAndRegisterDependency() {
    if (isProdConfig(this.dbConfig)) {
      await this.prodConnect();
    } else {
      await this.defaultConnect();
    }

    this.logger.info('authenticating db . . .');
    await this.db.authenticate();
    this.logger.info('Success!');

    container.register<DbLayer>(DbLayer, { useValue: this.db });
  }

  public async init() {
    // connect & setup injection
    await this.connectAndRegisterDependency();

    // run the migrations
    this.logger.info('running migrations...');
    await this.db.runMigrations();

    // init models
    this.logger.info('initializing models...');
    await this.db.initialize(modelInitialization);
  }
}
