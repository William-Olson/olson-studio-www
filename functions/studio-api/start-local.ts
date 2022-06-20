import 'reflect-metadata';

import { container } from 'tsyringe';
import { Server } from './src/Server';

(async () => {
  // resolve the server instance
  const studioApiServer = container.resolve(Server);

  // run the express server like normal
  (await studioApiServer.init()).start();
})();
