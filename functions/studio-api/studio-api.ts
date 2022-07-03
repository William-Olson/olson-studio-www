import 'reflect-metadata';
require('pg'); // netlify/functions workaround
import { Handler } from '@netlify/functions';
import { Context } from '@netlify/functions/dist/function/context';
import { Event } from '@netlify/functions/dist/function/event';
import { Response } from '@netlify/functions/dist/function/response';

import { container } from 'tsyringe';
import { DataLayer } from './src/data/DataLayer';
import { Server } from './src/Server';

// or as a promise
export const handler: Handler = async (event: Event, context: Context) => {
  const server = container.resolve(Server);

  // setup express routes etc.
  await server.init();

  // initialize db client
  const database = container.resolve(DataLayer);
  await database.init();

  // handle lambda request with express in serverless mode
  const handlerFn = server.serverless;
  const resp: Response = (await handlerFn(event, context)) as Response;
  return resp;
};

module.exports.handler = handler;
