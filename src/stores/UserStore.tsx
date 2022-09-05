import { StudioApiUser } from '../types/StudioApiTypes';
import { observable, action, makeObservable } from 'mobx';

class UserStore {
  public user?: StudioApiUser;

  constructor() {
    makeObservable(this, {
      user: observable,
      setUser: action
    });
  }

  public setUser(user?: StudioApiUser): void {
    this.user = user;
  }
}

export const UserState = new UserStore();
