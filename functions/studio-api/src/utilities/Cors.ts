import { CorsOptions } from 'cors';
import ErrorResponse from './ErrorResponse';
import { StatusCodes } from 'http-status-codes';
import { Logger } from '../services/Logger';

const whitelist = [
  'http://localhost:3000',
  'https://olson.studio',
  'https://www.olson.studio',
  'https://zina.olson.studio',
  'https://william.olson.studio',
  'https://jana.olson.studio',
  'https://family.olson.studio'
];

const allowOrigin = (requestOriginStr: string): boolean =>
  !!whitelist.find(
    (whitelistEntry: string) =>
      requestOriginStr.startsWith(whitelistEntry) ||
      whitelistEntry === requestOriginStr
  );

export const getCorsOptions: (logger: Logger) => CorsOptions = (
  logger: Logger
): CorsOptions => ({
  origin: (
    requestOrigin: string | undefined,
    callback: (err: Error | null, origin: boolean) => void
  ): void => {
    if (!requestOrigin) {
      logger.info('allowing origin <blank>');
      return callback(null, true);
    }

    if (allowOrigin(requestOrigin)) {
      logger.info('allowing origin ' + requestOrigin);
      return callback(null, true);
    }
    logger.error('rejecting origin -> not found in whitelist: ', requestOrigin);
    callback(
      new ErrorResponse(StatusCodes.FORBIDDEN, 'Not allowed by CORS'),
      false
    );
  }
});
