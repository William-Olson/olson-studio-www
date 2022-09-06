import React from 'react';
import { ProfileBanner } from './ProfileBanner';
import { ProfileDetails } from './ProfileDetails';
import { StudioApiService } from '../../../services/StudioApiService';
import { Token } from '../../../util/Auth';
import { ProfileSessions } from './ProfileSessions';
import { UserState } from '../../../stores/UserStore';
import { observer } from 'mobx-react';

export const ProfilePage = observer(
  class extends React.Component {
    private api: StudioApiService = new StudioApiService();
    private userStore: typeof UserState = UserState;

    public async logout(): Promise<void> {
      const token: Token = Token.fromCache();
      await this.api.deleteCurrentSession(token);
      Token.clearCache();
      window.location.replace('/');
    }

    public render() {
      return (
        <div className="md:w-[900px] max-w-[900px] opacity-95 m-auto">
          <ProfileBanner />
          <ProfileDetails />
          <ProfileSessions />
          {!!this.userStore?.user && (
            <div className="p-9 text-center auto-cols-max max-w-[650px] m-auto">
              <button
                className="border-2 border-inherit rounded py-1 px-3"
                onClick={() => this.logout()}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }
  }
);
