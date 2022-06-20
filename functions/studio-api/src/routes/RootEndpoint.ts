import { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';

@injectable()
export class RootEndpoint {
  constructor(@inject('HarnessDependency') harness: HarnessDependency) {
    const router: HarnessDependency = harness.getRouterForClass(
      RootEndpoint.name
    );

    this.getRoot = this.getRoot.bind(this);
    this.healthCheck = this.healthCheck.bind(this);

    router.get('/', this.getRoot);
    router.post('/', this.getRoot); // for cli: `ntl functions:invoke studio-api`
    router.get('/health', this.healthCheck);
  }

  getRoot() {
    return { success: true, message: `Welcome!` };
  }

  healthCheck() {
    return { success: true, statusCode: 200 };
  }
}

export default RootEndpoint;
