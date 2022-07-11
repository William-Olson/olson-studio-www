import { injectable } from 'tsyringe';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';

@injectable()
export class RootEndpoint extends BaseEndpoint implements RouterClass {
  mountRoutes() {
    this.getRoot = this.getRoot.bind(this);
    this.healthCheck = this.healthCheck.bind(this);

    this.router.get('/', this.getRoot);
    this.router.post('/', this.getRoot); // for cli: `ntl functions:invoke studio-api`
    this.router.get('/health', this.healthCheck);
  }

  getRoot() {
    return { success: true, message: `Welcome!` };
  }

  healthCheck() {
    const date = new Date();
    return { success: true, statusCode: 200, timestamp: date.toISOString() };
  }
}

export default RootEndpoint;
