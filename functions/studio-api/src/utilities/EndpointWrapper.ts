import { Handler, NextFunction, Response, Request } from 'express';
import {
  WrappedHandler,
  RouteInformation,
  CustomWrapper,
  Injectables
} from 'route-harness';
import LoggerFactory, { Logger } from '../services/Logger';

const mapped: Set<string> = new Set();

export const endpointWrapper: CustomWrapper = (
  handler: WrappedHandler,
  info: RouteInformation,
  deps: Injectables
): Handler => {
  const logFactory: LoggerFactory = deps['LoggerFactory'] as LoggerFactory;
  const initLogger: Logger = logFactory.getLogger('app:harness:init');
  const logger: Logger = logFactory.getLogger('app:harness');

  const endpointName = `${info.method.toUpperCase()}:  ${info.fullPath}`;
  const handlerName = `${info.routeClass}.${info.handler
    .replace('bound', '')
    .trim()}`;
  if (!mapped.has(`${handlerName}-${info.basePath}`)) {
    initLogger.silly(`mapping: ${info.routeClass}@${info.basePath}`);
    mapped.add(`${handlerName}-${info.basePath}`);
  }

  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      logger.info(
        `[ ${endpointName} ] ${handlerName}.Request:` +
          ` { Params: ${JSON.stringify(request.params)}` +
          `, Query: ${JSON.stringify(request.query)}` +
          `, Body: ${JSON.stringify(request.body)} }`
      );
      const result = await handler(request, response);
      if (result) {
        if (result.status >= 400 || result.statusCode >= 400) {
          logger.error(result);
        }
        logger.info(
          `[ ${endpointName} ] ${handlerName}.Response: ${JSON.stringify(
            result
          )}`
        );
        response.send(result);
      }
    } catch (error) {
      logger.error(`Error in route ${endpointName} ${handlerName}`);
      next(error);
    }
  };
};

export default endpointWrapper;
