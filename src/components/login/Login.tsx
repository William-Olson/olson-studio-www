import React, { ReactElement } from 'react';
import { LogoTypes } from '../../types/AppTypes';
import { CustomLogo } from '../CustomLogo';
import { getGoogleLoginUrl } from './Google';
import { GoogleButton } from './GoogleButton';
import { observer } from 'mobx-react';
import { DarkModeState } from '../../stores/DarkModeStore';

interface LoginProps {}

export const LoginComponent = observer(
  class extends React.Component<LoginProps> {
    private darkMode: typeof DarkModeState = DarkModeState;
    constructor(props: LoginProps) {
      super(props);
      this.goToGoogleLogin = this.goToGoogleLogin.bind(this);
    }

    private goToGoogleLogin() {
      window.location.replace(getGoogleLoginUrl());
    }

    public render(): ReactElement {
      return (
        <div className="content-wrapper">
          <div className="max-w-md w-full justify-content-center ml-auto mr-auto">
            <div className="flex-column items-center">
              <div className="w-64 flex-row ml-auto mr-auto">
                <CustomLogo logo={LogoTypes.Studio} />
              </div>
              <h2 className="mt-6 text-center flex-row text-3xl font-extrabold text-gray-900">
                Sign in to your account
              </h2>
            </div>
            <div>
              <GoogleButton
                darkMode={this.darkMode}
                onClick={() => this.goToGoogleLogin()}
              />
            </div>
          </div>
        </div>
      );
    }
  }
);
