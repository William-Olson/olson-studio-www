import 'reflect-metadata';

import { container } from 'tsyringe';
import { DataLayer } from './src/data/DataLayer';
import { Server } from './src/Server';

(async () => {
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
  (await studioApiServer.init()).start();
})();
