import { StudioApiUser } from '../types/StudioApiTypes';
import { observable, action, makeObservable, computed } from 'mobx';

class UserStore {
  public user?: StudioApiUser;

  constructor() {
    makeObservable(this, {
      user: observable,
      setUser: action,
      isAdmin: computed
    });
  }

  public get isAdmin(): boolean {
    if (!this.user) {
      return false;
    }

    const badge = this.user.badges?.find((b) => b.name === 'admin');
    return !!(badge?.name === 'admin');
  }

  public setUser(user?: StudioApiUser): void {
    this.user = user;
  }
}

export const UserState = new UserStore();
