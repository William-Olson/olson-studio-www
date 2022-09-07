import 'reflect-metadata';

import { container } from 'tsyringe';
import { DataLayer } from './src/data/DataLayer';
import { Server } from './src/Server';
import LoggerFactory from './src/services/Logger';
import { IdUtil } from './src/utilities/IdUtil';

(async () => {
  const logFactory = container.resolve(LoggerFactory);
  logFactory.contextId = IdUtil.newRequestId();
  const logger = logFactory.getLogger('app:boot');

  // resolve the server instance
  const studioApiServer = container.resolve(Server);

  try {
    // initialize db client
    const database = container.resolve(DataLayer);
    await database.init();
  } catch (err) {
    console.error('error connecting to db', err);
  }

  // run the express server like normal
  const base = 10;
  let port: number | undefined;
  if (process.env.APP_PORT) {
    port = parseInt(process.env.APP_PORT, base);
  }

  logger.info('starting server on port ' + port);
  (await studioApiServer.init()).start(port);
})();
