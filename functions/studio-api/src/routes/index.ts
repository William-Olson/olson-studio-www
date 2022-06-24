import { VersionEndpoint } from './VersionEndpoint';
import { TestEndpoint } from './TestEndpoint';
import { RootEndpoint } from './RootEndpoint';
import GoogleAuthEndpoint from './GoogleAuthEndpoint';

export const routes: Array<[string, Array<unknown>, unknown]> = [
  ['/version', [], VersionEndpoint],
  ['/test', [], TestEndpoint],
  ['/oauth2/redirect/google', [], GoogleAuthEndpoint],
  ['/', [], RootEndpoint]
];
