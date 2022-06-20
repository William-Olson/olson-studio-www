import { Request } from 'express';
import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';

@injectable()
export class TestEndpoint {
  constructor(@inject('HarnessDependency') harness: HarnessDependency) {
    const router: HarnessDependency = harness.getRouterForClass(
      TestEndpoint.name
    );
    router.get('/', this.getRoot.bind(this));
  }

  getRoot(req: Request) {
    const { name = 'stranger' } = req.query;
    return { success: true, message: `Hi there, ${name}!` };
  }
}

export default TestEndpoint;
