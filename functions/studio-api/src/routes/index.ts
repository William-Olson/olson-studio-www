import { VersionEndpoint } from './VersionEndpoint';
import { TestEndpoint } from './TestEndpoint';
import { RootEndpoint } from './RootEndpoint';

export const routes: Array<[string, Array<any>, any]> = [
  ['/version', [], VersionEndpoint],
  ['/test', [], TestEndpoint],
  ['/', [], RootEndpoint]
];
