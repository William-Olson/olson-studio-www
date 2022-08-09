import 'reflect-metadata';
require('pg'); // netlify/functions workaround
import { Handler } from '@netlify/functions';
import { Context } from '@netlify/functions/dist/function/context';
import { Event } from '@netlify/functions/dist/function/event';
import { Response } from '@netlify/functions/dist/function/response';
import { container } from 'tsyringe';
import { DataLayer } from './src/data/DataLayer';
import { Server } from './src/Server';
import { LoggerFactory } from './src/services/Logger';
import { RemoteLogger } from './src/services/RemoteLogger';

export const handler: Handler = async (event: Event, context: Context) => {
  const server = container.resolve(Server);
  const loggerFactory = container.resolve(LoggerFactory);
  const remoteLogger = container.resolve(RemoteLogger);
  const logger = loggerFactory.getLogger('app:boot');

  // setup express routes etc.
  await server.init();

  try {
    // initialize db client
    const database = container.resolve(DataLayer);
    await database.init();
  } catch (err) {
    logger.error('error initializing data layer', err);
  }

  // handle lambda request with express in serverless mode
  try {
    const handlerFn = server.serverless;
    const resp: Response = (await handlerFn(event, context)) as Response;

    return resp;
  } catch (err) {
    logger.error('error in lambda', err);
    throw err;
  } finally {
    // wait for logs to be uploaded
    await remoteLogger.flush();
  }
};

module.exports.handler = handler;
