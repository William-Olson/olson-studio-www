import React, { ReactElement } from 'react';
import { DarkModeChangeEvent, emitter } from '../../Events';
import { DarkModeTypes, LogoTypes } from '../../types/AppTypes';
import { getDarkModeType } from '../../util/DarkMode';
import { CustomLogo } from '../CustomLogo';
import { getGoogleLoginUrl } from './Google';
import { GoogleButton } from './GoogleButton';

interface LoginProps {}
interface LoginState {
  darkModeType: DarkModeTypes;
}

export class LoginComponent extends React.Component<LoginProps, LoginState> {
  constructor(props: LoginProps) {
    super(props);
    this.goToGoogleLogin = this.goToGoogleLogin.bind(this);
    this.handleDarkModeChange = this.handleDarkModeChange.bind(this);
    this.state = {
      darkModeType: getDarkModeType()
    };
  }

  public componentDidMount() {
    emitter.on('darkMode', this.handleDarkModeChange);
  }

  public componentWillUnmount() {
    emitter.off('darkMode', this.handleDarkModeChange);
  }

  private handleDarkModeChange(changed: DarkModeChangeEvent) {
    this.setState({
      darkModeType: changed.darkModeType
    });
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
            <GoogleButton onClick={() => this.goToGoogleLogin()} />
          </div>
        </div>
      </div>
    );
  }
}
