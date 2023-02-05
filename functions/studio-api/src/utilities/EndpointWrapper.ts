import { Handler, NextFunction, Response, Request } from 'express';
import {
  WrappedHandler,
  RouteInformation,
  CustomWrapper,
  Injectables
} from 'route-harness';
import LoggerFactory, { Logger } from '../services/Logger';
import { isDev } from './isDev';

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
      if (!result) {
        return;
      }

      if (result.status >= 400 || result.statusCode >= 400) {
        logger.error(result);
      } else {
        const responseLogMessage = `[ ${endpointName} ] ${handlerName}.Response: ${
          result.status || result.statusCode || 200
        }`;
        logger.info(
          responseLogMessage +
            // include success response data in development logs only
            (isDev
              ? `\n${JSON.stringify(
                  result
                  // undefined,
                  // 2
                )}`
              : '')
        );
      }
      response.send(result);
    } catch (error) {
      logger.error(`Error in route ${endpointName} ${handlerName}`);
      logger.error(error);
      next(error);
    }
  };
};

export default endpointWrapper;
