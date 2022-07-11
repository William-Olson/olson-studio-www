import serverless from 'serverless-http';
import { container, inject, injectable } from 'tsyringe';
import cors from 'cors';
import express, {
  NextFunction,
  Request,
  Response
  // static as expressStatic
} from 'express';
import * as bodyParser from 'body-parser';
import path from 'path';

import ErrorResponse from './utilities/ErrorResponse';
import LoggerFactory, { Logger } from './services/Logger';

import { StatusCodes } from 'http-status-codes';
import { ApiRoutes } from './routes';
import RouteHarness, { HarnessDependency, RouteClass } from 'route-harness';
import endpointWrapper from './utilities/EndpointWrapper';
import { getCorsOptions } from './utilities/Cors';

/*
  ExpressServer
  Handles starting the express server, adding middleware,
  initializing router classes, and setting up error handling.

  Registers dependencies: HarnessDependency
*/
@injectable()
export class Server {
  private readonly BASE_PATH: string = '/.netlify/functions/studio-api';
  private logger: Logger;
  private loggerFactory: LoggerFactory;
  private app: express.Application;
  private harness: RouteHarness;

  constructor(@inject(LoggerFactory) loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.getLogger('app:server');
    this.loggerFactory = loggerFactory;

    this.app = express();
    this.harness = new RouteHarness(this.app, {
      factory: (C) => container.resolve(C),
      inject: { LoggerFactory: loggerFactory },
      customWrapper: endpointWrapper
    });

    // register the harness
    container.register<HarnessDependency>('RouteHarness', {
      useValue: this.harness.asDependency()
    });
  }

  public async init(): Promise<Server> {
    // add middleware
    this.logger.info('adding middleware...');
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    const corsOpts = getCorsOptions(this.loggerFactory.getLogger('app:cors'));
    this.app.use(cors(corsOpts));

    // add routes
    this.logger.info('adding routes...');
    const apiRoutes = container.resolve(ApiRoutes);
    for (const [endpointPath, mdlwr, route] of apiRoutes.getRoutes()) {
      await this.harness.use(
        path.join(this.BASE_PATH, endpointPath),
        mdlwr as express.Handler[],
        route as RouteClass<unknown>
      );
    }

    this.logger.info('adding error handlers...');
    this.addErrorHandlers();

    return this;
  }

  public get instance(): express.Application {
    return this.app;
  }

  public get serverless(): serverless.Handler {
    return serverless(this.app);
  }

  public start(port = 4774): void {
    this.app.listen(port, () =>
      this.logger.info(`starting app at \n\t http://localhost:${port}`)
    );
  }

  private addErrorHandlers() {
    this.app.use((req, res, next) => {
      this.logger.info('404 error... ' + req.path);
      next(new ErrorResponse(404, 'Resource Not Found'));
    });

    this.app.use(
      (
        err?: ErrorResponse,
        req?: Request,
        res?: Response,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        next?: NextFunction
      ) => {
        let statusCode = err?.statusCode || 500;

        // set statusCode for auth-errors from middleware
        if (this.isAuthErrorMessage(err?.message || '')) {
          statusCode = StatusCodes.UNAUTHORIZED;
        }

        // only allow message for 4XX errors, otherwise default to basic message
        let message = err?.message || 'Internal Server Error';
        message =
          `${statusCode}`[0] === '4' ? message : 'Internal Server Error';

        res?.status(statusCode);
        res?.send({ status: statusCode, message });
      }
    );
  }

  private isAuthErrorMessage(message: string): boolean {
    if (!message) {
      return false;
    }

    return /authorization/gim.test(message) || message === 'invalid signature';
  }
}

export default Server;
