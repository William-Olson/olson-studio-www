import { injectable } from 'tsyringe';
import { AuthRequest } from '../services/Auth';
import BaseEndpoint, { RouterClass } from './BaseEndpoint';

@injectable()
export class UserProfileEndpoint extends BaseEndpoint implements RouterClass {
  public mountRoutes() {
    this.router.get('/', this.getUserProfile.bind(this));
  }

  getUserProfile(req: AuthRequest) {
    return req.user?.toJSON() || req.user;
  }
}

export default UserProfileEndpoint;
