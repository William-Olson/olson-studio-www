import { Request } from 'express';
import { injectable } from 'tsyringe';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';

@injectable()
export class TestEndpoint extends BaseEndpoint implements RouterClass {
  public mountRoutes() {
    this.router.get('/', this.getRoot.bind(this));
  }

  getRoot(req: Request) {
    const { name = 'stranger' } = req.query;
    return { success: true, message: `Hi there, ${name}!` };
  }
}

export default TestEndpoint;
