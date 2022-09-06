import { StudioApiSession, StudioApiSessions } from '../types/StudioApiTypes';
import { observable, action, makeObservable, runInAction } from 'mobx';
import { StudioApiService } from '../services/StudioApiService';
import { Token } from '../util/Auth';

class SessionsStore {
  public activeSessions?: StudioApiSessions;
  public api: StudioApiService = new StudioApiService();

  constructor() {
    makeObservable(this, {
      activeSessions: observable,
      fetchSessions: action,
      revoke: action
    });
  }

  public async fetchSessions(): Promise<void> {
    const resp = await this.api.getActiveSessions(Token.fromCache());

    runInAction(() => {
      this.activeSessions = resp;
    });
  }

  public async revoke(session: StudioApiSession): Promise<void> {
    await this.api.revokeSession(session.id || '', Token.fromCache());
    await this.fetchSessions();
  }
}

export const SessionsState = new SessionsStore();
