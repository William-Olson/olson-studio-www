import React from 'react';
import { observer } from 'mobx-react';
import { UserState } from '../../../stores/UserStore';
import { DarkModeState } from '../../../stores/DarkModeStore';

export const ProfileBanner = observer(
  class extends React.Component {
    private userStore: typeof UserState = UserState;
    private darkMode: typeof DarkModeState = DarkModeState;
    render() {
      let imageBorderColor = 'border-white';
      if (!this.darkMode.isDark) {
        imageBorderColor = 'border-black';
      }
      return (
        <div className="pb-20 w-90 text-center">
          <header>
            <div className="flex justify-center">
              {!!this.userStore?.user?.avatar && (
                <div className="h-32 w-32">
                  <img
                    id="user-avatar"
                    className={
                      'inline object-cover w-32 h-32 rounded-full border-4 ' +
                      imageBorderColor
                    }
                    src={this.userStore?.user.avatar}
                    alt="user avatar"
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}
            </div>
            <h1 className="text-6xl font-mono pb-3 mt-6">
              {this.userStore?.user?.firstName} {this.userStore.user?.lastName}
            </h1>
            <p></p>
          </header>
        </div>
      );
    }
  }
);
