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
                <div className="h-28 w-28">
                  <img
                    id="user-avatar"
                    className={
                      'inline object-cover w-28 h-28 rounded-full border-4 ' +
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
