import React, { ReactElement } from 'react';
import customLogoGetters from '../util/images/LogoTypes';
import { getDarkModeType, isDarkMode } from '../util/DarkMode';
import { DarkModeTypes, LogoTypes } from '../types/AppTypes';
import { DarkModeChangeEvent, emitter } from '../Events';

export interface LogoProps extends React.SVGProps<ReactElement> {
  logo: LogoTypes;
  color?: string;
}

export interface LogoState extends React.SVGProps<ReactElement> {
  darkModeType: DarkModeTypes;
}

export class CustomLogo extends React.Component<LogoProps, LogoState> {
  constructor(props: LogoProps) {
    super(props);
    this.handleDarkModeChange = this.handleDarkModeChange.bind(this);
    this.state = {
      darkModeType: getDarkModeType()
    };
  }

  componentDidMount() {
    emitter.on('darkMode', this.handleDarkModeChange);
  }

  componentWillUnmount() {
    emitter.off('darkMode', this.handleDarkModeChange);
  }

  public handleDarkModeChange(changed: DarkModeChangeEvent) {
    this.setState({
      darkModeType: changed.darkModeType
    });
  }

  render() {
    const logoGetter = customLogoGetters.get(this.props.logo);
    let color = this.props.color;
    if (!logoGetter) {
      throw new Error(
        'Unable to find custom logo getter for ' + this.props.logo
      );
    }

    if (!color) {
      if (isDarkMode()) {
        color = '#DBD9D4';
      } else {
        color = '#1A0609';
      }
    }

    return logoGetter(color);
  }
}
