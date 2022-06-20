import { Handler, NextFunction, Response, Request } from 'express';
import {
  WrappedHandler,
  RouteInformation,
  CustomWrapper,
  Injectables
} from 'route-harness';
import LoggerFactory, { Logger } from '../services/Logger';

export const endpointWrapper: CustomWrapper = (
  handler: WrappedHandler,
  info: RouteInformation,
  deps: Injectables
): Handler => {
  const logFactory: LoggerFactory = deps['LoggerFactory'] as LoggerFactory;
  const initLogger: Logger = logFactory.getLogger('app:harness:init');
  const logger: Logger = logFactory.getLogger('app:harness');

  const endpointName: string = `${info.method.toUpperCase()} ${info.fullPath}`;
  const handlerName: string = `${info.routeClass}.'${info.handler}'`;
  initLogger.info(`[harness] mapping: ${endpointName} to ${handlerName}`);

  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      logger.info(
        `[harness] route hit: ${endpointName} ${handlerName}` +
          `, Params: ${JSON.stringify(request.params)}` +
          `, Query: ${JSON.stringify(request.query)}` +
          `, Body: ${JSON.stringify(request.body)}`
      );
      const result = await handler(request, response);
      if (result) {
        response.send(result);
      }
    } catch (error) {
      logger.error(`[harness] error in route ${endpointName} ${handlerName}`);
      next(error);
    }
  };
};

export default endpointWrapper;
