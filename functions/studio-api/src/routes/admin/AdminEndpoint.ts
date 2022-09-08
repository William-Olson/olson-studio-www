import { NextFunction, Response } from 'express';
import { HarnessDependency, WrappedHandler } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import { BadgeNames } from '../../data/models/Badge';
import { AdminRequest, AuthRequest } from '../../services/Auth';
import LoggerFactory, { Logger } from '../../services/Logger';

export interface AdminRouter {
  get: (path: string, fn: AdminHandler) => void;
  post: (path: string, fn: AdminHandler) => void;
  put: (path: string, fn: AdminHandler) => void;
  delete: (path: string, fn: AdminHandler) => void;
  patch: (path: string, fn: AdminHandler) => void;
}

type AdminHandler = (
  req: AdminRequest,
  res: Response,
  next?: NextFunction
) => any;

export const isAdminRequest = (
  req: AuthRequest | AdminRequest
): req is AdminRequest => {
  return (
    !!req.user &&
    !!req.session &&
    !!(req.user.Badges || []).find((badge) => badge.name === BadgeNames.Admin)
  );
};

@injectable()
export class AdminEndpoint {
  public logger: Logger;
  public router: AdminRouter;

  constructor(
    @inject('RouteHarness') harness: HarnessDependency,
    @inject(LoggerFactory) loggerFactory: LoggerFactory
  ) {
    this.logger = loggerFactory.getLogger(
      `app:admin-route:${this.constructor.name}`
    );
    const router = harness.getRouterForClass(this.constructor.name);
    this.router = {
      get: (path: string, fn: AdminHandler) => {
        router.get(path, fn as unknown as WrappedHandler);
      },
      post: (path: string, fn: AdminHandler) => {
        router.post(path, fn as unknown as WrappedHandler);
      },
      put: (path: string, fn: AdminHandler) => {
        router.put(path, fn as unknown as WrappedHandler);
      },
      delete: (path: string, fn: AdminHandler) => {
        router.delete(path, fn as unknown as WrappedHandler);
      },
      patch: (path: string, fn: AdminHandler) => {
        router.patch(path, fn as unknown as WrappedHandler);
      }
    };

    this.mountRoutes();
  }

  mountRoutes(): void {
    throw new Error(
      `mountRoutes not implemented in route subclass ${this.constructor.name}`
    );
  }
}

export default AdminEndpoint;
