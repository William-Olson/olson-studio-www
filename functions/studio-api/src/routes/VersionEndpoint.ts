import type { HarnessDependency } from 'route-harness';
import { inject, injectable } from 'tsyringe';
import packageJson from '../../../../package.json';

interface VersionResponse {
  app: string;
}

@injectable()
export class VersionEndpoint {
  private router: any;
  constructor(@inject('HarnessDependency') harness: HarnessDependency) {
    // TODO: abstract this logic to a super class with a protected router property??
    this.router = harness.getRouterForClass(VersionEndpoint.name);
    this.router.get('/', this.getVersion.bind(this));
  }

  public getVersion(): VersionResponse {
    return {
      app: packageJson.version
    };
  }
}
