import React from 'react';
import { ProfileBanner } from './ProfileBanner';
import { ProfileDetails } from './ProfileDetails';
import { StudioApiService } from '../../../services/StudioApiService';
import { Token } from '../../../util/Auth';

export class ProfilePage extends React.Component {
  private api: StudioApiService = new StudioApiService();

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
        <div className="p-9 text-center auto-cols-max max-w-[650px] m-auto">
          <button onClick={() => this.logout()}>Logout</button>
        </div>
      </div>
    );
  }
}
